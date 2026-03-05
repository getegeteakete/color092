import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Home, 
  Building2, 
  Hammer, 
  AlertTriangle,
  Camera,
  Calculator,
  X,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { analyzePhotoDeterioration, calculateAIEstimate } from "@/lib/openai";
import { Sparkles, Loader2 } from "lucide-react";

type BuildingType = "戸建て" | "アパート" | "店舗";
type DeteriorationLevel = "軽度" | "中度" | "重度";

interface FormData {
  buildingType: BuildingType | "";
  buildingAge: string;
  floorArea: string;
  floors: string;
  workTypes: string[];
  deteriorationLevel: DeteriorationLevel | "";
  photos: File[];
}

interface PhotoAnalysis {
  deteriorationLevel: '軽度' | '中度' | '重度';
  analysis: string;
  confidence: number;
}

interface AIEstimate {
  min: number;
  max: number;
  breakdown: {
    item: string;
    amount: number;
    description: string;
  }[];
  aiNotes: string;
}

const STEPS = [
  { id: 1, title: "建物情報", icon: Building2 },
  { id: 2, title: "施工内容", icon: Hammer },
  { id: 3, title: "劣化状況", icon: AlertTriangle },
  { id: 4, title: "写真アップロード", icon: Camera },
  { id: 5, title: "概算見積", icon: Calculator },
];

const Estimate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzingPhotos, setIsAnalyzingPhotos] = useState(false);
  const [isCalculatingAI, setIsCalculatingAI] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const [aiEstimate, setAiEstimate] = useState<AIEstimate | null>(null);
  const [useAI, setUseAI] = useState(true); // AI使用フラグ
  const [formData, setFormData] = useState<FormData>({
    buildingType: "",
    buildingAge: "",
    floorArea: "",
    floors: "",
    workTypes: [],
    deteriorationLevel: "",
    photos: [],
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 写真プレビュー用URLを管理（createObjectURLのメモリ解放で表示エラー防止）
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const photoUrlsRef = useRef<string[]>([]);
  useEffect(() => {
    const urls = formData.photos.map((f) => URL.createObjectURL(f));
    photoUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    photoUrlsRef.current = urls;
    setPhotoPreviewUrls(urls);
    return () => {
      photoUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      photoUrlsRef.current = [];
    };
  }, [formData.photos]);

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      // STEP 4から5に進む際、AI見積もりを計算
      if (currentStep === 4 && useAI && import.meta.env.VITE_OPENAI_API_KEY) {
        await calculateAIEstimateAsync();
      }
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.buildingType || !formData.buildingAge || !formData.floorArea || !formData.floors) {
          toast({
            title: "入力エラー",
            description: "すべての項目を入力してください。",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (formData.workTypes.length === 0) {
          toast({
            title: "入力エラー",
            description: "少なくとも1つの施工内容を選択してください。",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        if (!formData.deteriorationLevel) {
          toast({
            title: "入力エラー",
            description: "劣化状況を選択してください。",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 4:
        // 写真は任意
        return true;
      default:
        return true;
    }
  };

  const calculateEstimate = () => {
    // 従来の計算ロジック（フォールバック用）
    const basePrice = 3000; // 基本単価（円/㎡）- 外壁塗装を含む
    const floorArea = parseFloat(formData.floorArea) || 0;
    
    // 基本金額（面積 × 単価）
    let baseAmount = floorArea * basePrice;
    
    // 劣化補正率を適用
    const deteriorationMultiplier = {
      軽度: 1.0,
      中度: 1.2,
      重度: 1.4,
    }[formData.deteriorationLevel as DeteriorationLevel] || 1.0;
    
    baseAmount *= deteriorationMultiplier;
    
    // 施工内容オプション（外壁塗装は基本に含まれるため追加しない）
    let optionAmount = 0;
    if (formData.workTypes.includes("屋根塗装")) optionAmount += 150000;
    if (formData.workTypes.includes("防水工事")) optionAmount += 200000;
    if (formData.workTypes.includes("内装リフォーム")) optionAmount += 300000;
    
    // 最小金額と最大金額を計算（20%のバッファを追加）
    const totalMin = baseAmount + optionAmount;
    const totalMax = totalMin * 1.2;
    
    // 税込（10%）で返す
    return {
      min: Math.round(totalMin * 1.1),
      max: Math.round(totalMax * 1.1),
    };
  };

  const calculateAIEstimateAsync = async () => {
    if (!useAI || !import.meta.env.VITE_OPENAI_API_KEY) {
      return null;
    }

    setIsCalculatingAI(true);
    try {
      const result = await calculateAIEstimate(
        formData.buildingType,
        parseInt(formData.buildingAge),
        parseFloat(formData.floorArea),
        parseInt(formData.floors),
        formData.workTypes,
        formData.deteriorationLevel,
        photoAnalysis || undefined
      );
      setAiEstimate(result);
      return result;
    } catch (error: any) {
      console.error('AI estimate error:', error);
      toast({
        title: "AI見積もりエラー",
        description: error.message || "AI見積もりの計算に失敗しました。従来の計算方法を使用します。",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCalculatingAI(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 10 - formData.photos.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      toast({
        title: "写真の上限",
        description: `最大10枚までアップロードできます。${remainingSlots}枚を追加しました。`,
      });
    }
    
    const newPhotos = [...formData.photos, ...filesToAdd];
    updateFormData("photos", newPhotos);
    
    // 写真が追加されたら自動でAI分析を実行（オプション）
    if (newPhotos.length > 0 && useAI && import.meta.env.VITE_OPENAI_API_KEY) {
      setIsAnalyzingPhotos(true);
      try {
        const analysis = await analyzePhotoDeterioration(newPhotos);
        setPhotoAnalysis(analysis);
        
        // AI分析結果を劣化状況に反映（ユーザーがまだ選択していない場合）
        if (!formData.deteriorationLevel) {
          updateFormData("deteriorationLevel", analysis.deteriorationLevel);
        }
        
        toast({
          title: "写真分析完了",
          description: `AI分析結果: ${analysis.deteriorationLevel} (信頼度: ${(analysis.confidence * 100).toFixed(0)}%)`,
        });
      } catch (error: any) {
        console.error('Photo analysis error:', error);
        toast({
          title: "写真は追加されました",
          description: "AI分析はスキップしました。劣化状況を手動で選択してください。",
        });
      } finally {
        setIsAnalyzingPhotos(false);
      }
    }
  };

  const removePhoto = (index: number) => {
    updateFormData("photos", formData.photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // 見積計算（AI見積もりがあれば使用、なければ従来の計算）
      const estimate = aiEstimate 
        ? { min: aiEstimate.min, max: aiEstimate.max }
        : calculateEstimate();
      
      // 写真をSupabase Storageにアップロード（オプション）
      const photoUrls: string[] = [];
      
      if (formData.photos.length > 0) {
        try {
          for (const photo of formData.photos) {
            const fileExt = photo.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `estimates/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('estimate-photos')
              .upload(filePath, photo);
            
            if (uploadError) {
              console.error('Upload error:', uploadError);
              // 写真のアップロードに失敗しても続行
              continue;
            }
            
            const { data } = supabase.storage
              .from('estimate-photos')
              .getPublicUrl(filePath);
            
            if (data?.publicUrl) {
              photoUrls.push(data.publicUrl);
            }
          }
        } catch (photoError) {
          console.error('Photo upload error:', photoError);
          // 写真のアップロードに失敗しても続行
        }
      }
      
      // データベースに保存
      try {
        const { data, error } = await supabase
          .from('estimates')
          .insert({
            building_type: formData.buildingType,
            building_age: parseInt(formData.buildingAge),
            floor_area: parseFloat(formData.floorArea),
            floors: parseInt(formData.floors),
            work_types: formData.workTypes,
            deterioration_level: formData.deteriorationLevel,
            photo_urls: photoUrls,
            estimate_min: estimate.min,
            estimate_max: estimate.max,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "見積もりを保存しました",
          description: "予約ページに進みます。",
        });
        
        // 予約ページに遷移（estimate_idを渡す）
        navigate(`/reservation?estimate_id=${data.id}`);
      } catch (dbError: any) {
        // Supabaseが設定されていない場合、ローカルストレージに保存して続行
        if (dbError.message?.includes('fetch') || dbError.message?.includes('network')) {
          console.warn('Supabase not configured, saving to localStorage');
          const estimateData = {
            id: `local_${Date.now()}`,
            building_type: formData.buildingType,
            building_age: parseInt(formData.buildingAge),
            floor_area: parseFloat(formData.floorArea),
            floors: parseInt(formData.floors),
            work_types: formData.workTypes,
            deterioration_level: formData.deteriorationLevel,
            photo_urls: photoUrls,
            estimate_min: estimate.min,
            estimate_max: estimate.max,
            created_at: new Date().toISOString(),
          };
          
          localStorage.setItem('last_estimate', JSON.stringify(estimateData));
          
          toast({
            title: "見積もりを計算しました",
            description: "Supabaseが設定されていないため、ローカルに保存しました。予約ページに進みます。",
          });
          
          navigate(`/reservation?estimate_id=${estimateData.id}`);
        } else {
          throw dbError;
        }
      }
      
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "エラーが発生しました",
        description: error.message || "見積もりの保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 見積もり結果を取得（AI見積もりがあれば優先、なければ従来の計算）
  const estimate = currentStep === 5 
    ? (aiEstimate ? { min: aiEstimate.min, max: aiEstimate.max } : calculateEstimate())
    : null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-16 bg-hero-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-pink/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <span className="section-label">AI Estimate</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">AI仮見積もり</h1>
              <p className="text-muted-foreground text-lg">
                簡単な情報入力で、AIが自動で概算見積もりを算出します。
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ※この見積もりは仮見積もりです。実際の金額は現地調査後に確定します。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="py-8 bg-card border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Progress value={(currentStep / STEPS.length) * 100} className="h-2 mb-4" />
              <div className="flex justify-between items-center">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center gap-2 ${
                        currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= step.id
                            ? "bg-gradient-to-br from-pink to-accent text-white"
                            : "bg-muted"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* STEP 1: 建物情報 */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6">建物情報を入力してください</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="buildingType">建物種別 <span className="text-destructive">*</span></Label>
                          <Select
                            value={formData.buildingType}
                            onValueChange={(value) => updateFormData("buildingType", value as BuildingType)}
                          >
                            <SelectTrigger id="buildingType" className="mt-2">
                              <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="戸建て">戸建て</SelectItem>
                              <SelectItem value="アパート">アパート</SelectItem>
                              <SelectItem value="店舗">店舗</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="buildingAge">築年数 <span className="text-destructive">*</span></Label>
                          <Input
                            id="buildingAge"
                            type="number"
                            min="0"
                            placeholder="例: 10"
                            value={formData.buildingAge}
                            onChange={(e) => updateFormData("buildingAge", e.target.value)}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="floorArea">延床面積（㎡） <span className="text-destructive">*</span></Label>
                          <Input
                            id="floorArea"
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="例: 100.5"
                            value={formData.floorArea}
                            onChange={(e) => updateFormData("floorArea", e.target.value)}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="floors">階数 <span className="text-destructive">*</span></Label>
                          <Input
                            id="floors"
                            type="number"
                            min="1"
                            placeholder="例: 2"
                            value={formData.floors}
                            onChange={(e) => updateFormData("floors", e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: 施工内容 */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6">施工内容を選択してください</h2>
                      <p className="text-muted-foreground mb-6">複数選択可能です</p>
                      
                      <div className="space-y-4">
                        {["外壁塗装", "屋根塗装", "防水工事", "内装リフォーム"].map((workType) => (
                          <div key={workType} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                            <Checkbox
                              id={workType}
                              checked={formData.workTypes.includes(workType)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateFormData("workTypes", [...formData.workTypes, workType]);
                                } else {
                                  updateFormData("workTypes", formData.workTypes.filter((t) => t !== workType));
                                }
                              }}
                            />
                            <Label htmlFor={workType} className="flex-1 cursor-pointer font-normal">
                              {workType}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: 劣化状況 */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6">劣化状況を選択してください</h2>
                      
                      <RadioGroup
                        value={formData.deteriorationLevel}
                        onValueChange={(value) => updateFormData("deteriorationLevel", value as DeteriorationLevel)}
                      >
                        <div className="space-y-4">
                          {[
                            { value: "軽度", desc: "軽微な劣化、補修箇所が少ない" },
                            { value: "中度", desc: "中程度の劣化、一部補修が必要" },
                            { value: "重度", desc: "重度の劣化、大規模な補修が必要" },
                          ].map((level) => (
                            <div key={level.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                              <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                              <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                                <div className="font-medium">{level.value}</div>
                                <div className="text-sm text-muted-foreground">{level.desc}</div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* STEP 4: 写真アップロード */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold">写真をアップロードしてください</h2>
                          <p className="text-muted-foreground mt-2">最大10枚までアップロード可能です（任意）</p>
                        </div>
                        {import.meta.env.VITE_OPENAI_API_KEY && (
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium">AI分析対応</span>
                          </div>
                        )}
                      </div>

                      {/* AI分析結果表示 */}
                      {photoAnalysis && (
                        <div className="bg-gradient-to-br from-pink/10 to-accent/10 rounded-xl p-4 border border-border">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">AI写真分析結果</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">劣化状況:</span>
                                  <span className="font-medium">{photoAnalysis.deteriorationLevel}</span>
                                  <span className="text-xs text-muted-foreground">
                                    (信頼度: {(photoAnalysis.confidence * 100).toFixed(0)}%)
                                  </span>
                                </div>
                                <p className="text-muted-foreground">{photoAnalysis.analysis}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {isAnalyzingPhotos && (
                        <div className="flex items-center gap-2 text-primary">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">AIが写真を分析中...</span>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {formData.photos.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {formData.photos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={photoPreviewUrls[index] ?? ""}
                                  alt={`写真 ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(index)}
                                  className="absolute top-2 right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {formData.photos.length < 10 && (
                          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">クリックして写真を選択</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formData.photos.length}/10枚
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handlePhotoUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: 概算見積 */}
                  {currentStep === 5 && estimate && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">概算見積もり</h2>
                        {aiEstimate && (
                          <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-medium">AI算出</span>
                          </div>
                        )}
                      </div>

                      {isCalculatingAI ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                          <p className="text-muted-foreground">AIが詳細な見積もりを計算中...</p>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-pink/10 to-accent/10 rounded-3xl p-8 border border-border">
                          <div className="text-center mb-6">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                              {estimate.min.toLocaleString()}円
                            </div>
                            <div className="text-2xl text-muted-foreground mb-4">〜</div>
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-4">
                              {estimate.max.toLocaleString()}円
                            </div>
                            <p className="text-sm text-muted-foreground">（税込）</p>
                          </div>

                          {/* AI見積もりの内訳 */}
                          {aiEstimate && aiEstimate.breakdown.length > 0 && (
                            <div className="space-y-3 mt-8 pt-8 border-t border-border">
                              <h3 className="font-semibold mb-4">見積もり内訳</h3>
                              {aiEstimate.breakdown.map((item, index) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <span className="font-medium">{item.item}</span>
                                    {item.description && (
                                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                    )}
                                  </div>
                                  <span className="font-medium ml-4">{item.amount.toLocaleString()}円</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="space-y-3 mt-8 pt-8 border-t border-border">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">建物種別</span>
                              <span className="font-medium">{formData.buildingType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">延床面積</span>
                              <span className="font-medium">{formData.floorArea}㎡</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">施工内容</span>
                              <span className="font-medium">{formData.workTypes.join("、")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">劣化状況</span>
                              <span className="font-medium">
                                {formData.deteriorationLevel}
                                {photoAnalysis && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    (AI分析: {photoAnalysis.deteriorationLevel})
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* AIからの補足説明 */}
                          {aiEstimate && aiEstimate.aiNotes && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium mb-1">AIからの補足説明</p>
                                  <p className="text-sm text-muted-foreground">{aiEstimate.aiNotes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              ※この見積もりは仮見積もりです。実際の金額は現地調査後に確定します。
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t">
                <div>
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handlePrev}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      戻る
                    </Button>
                  )}
                </div>
                <div className="flex gap-4">
                  {currentStep < STEPS.length ? (
                    <Button onClick={handleNext} className="btn-gradient">
                      次へ
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="btn-gradient"
                    >
                      {isSubmitting ? "保存中..." : "見積もりを保存して予約へ"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Estimate;
