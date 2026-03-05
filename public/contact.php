<?php
/**
 * お問い合わせフォーム（Xserver用）
 * ① 会社に送信 ② お客様に自動返信（Xserverの mail() で送信）
 *
 * 自動返信が届かない場合:
 * - 迷惑メールフォルダを確認
 * - $MY_EMAIL がXserverで作成したメールアドレスになっているか確認
 * - Xserverの「メール送信」が有効か確認
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'POST only']);
    exit;
}

// ========== ここだけ編集 ==========
$MY_EMAIL = 'info@colors-official.com';  // Xserverで作成したメールアドレス
// ==================================

$raw = file_get_contents('php://input');
$data = (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false)
    ? (json_decode($raw, true) ?: [])
    : $_POST;

$name   = trim((string)($data['name'] ?? ''));
$phone  = trim((string)($data['phone'] ?? ''));
$email  = trim((string)($data['email'] ?? ''));
$subjectKey = trim((string)($data['subject'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

$labels = ['estimate' => 'お見積もり依頼', 'consultation' => 'ご相談', 'insurance' => '災害保険について', 'other' => 'その他'];
$subjectLabel = $labels[$subjectKey] ?? ($subjectKey ?: '（未選択）');

if ($name === '' || $phone === '' || $email === '' || $message === '') {
    echo json_encode(['ok' => false, 'error' => '必須項目を入力してください。']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'error' => 'メールアドレスの形式が正しくありません。']);
    exit;
}

// エンベロープ送信者を指定（Xserverで外部へ届きやすくする）
$envParam = "-f " . $MY_EMAIL;

// 件名をUTF-8で送る（日本語）
$encodeSubject = function ($s) {
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
};

// ① 会社へ送信
$bodyToMe = "お問い合わせがありました。\n\n";
$bodyToMe .= "お名前: $name\n電話番号: $phone\nメール: $email\n種別: $subjectLabel\n\nメッセージ:\n$message";

$h1 = "From: $MY_EMAIL\r\n";
$h1 .= "Reply-To: $email\r\n";
$h1 .= "Content-Type: text/plain; charset=UTF-8\r\n";
$h1 .= "MIME-Version: 1.0\r\n";

$ok1 = @mail(
    $MY_EMAIL,
    $encodeSubject("[COLORS] お問い合わせ: " . $subjectLabel),
    $bodyToMe,
    $h1,
    $envParam
);

if (!$ok1) {
    echo json_encode(['ok' => false, 'error' => '送信に失敗しました。しばらく経ってからお試しください。']);
    exit;
}

// ② お客様へ自動返信（Fromを「COLORS」表示にし、エンベロープ指定）
$bodyAuto = "${name} 様\n\n";
$bodyAuto .= "この度はお問い合わせいただきありがとうございます。\n";
$bodyAuto .= "内容を確認のうえ、担当者よりご連絡いたします。\n\n";
$bodyAuto .= "────────────────\n";
$bodyAuto .= "COLORS\n";
$bodyAuto .= "TEL. 090-6120-2995\n";
$bodyAuto .= "受付: 月〜金 9:00〜17:00\n";
$bodyAuto .= "────────────────\n";

$h2 = "From: COLORS <" . $MY_EMAIL . ">\r\n";
$h2 .= "Content-Type: text/plain; charset=UTF-8\r\n";
$h2 .= "MIME-Version: 1.0\r\n";

$ok2 = @mail(
    $email,
    $encodeSubject("[COLORS] お問い合わせを受け付けました"),
    $bodyAuto,
    $h2,
    $envParam
);

// 会社への送信は成功しているので ok: true。自動返信の成否はレスポンスに含める（確認用）
echo json_encode(['ok' => true, 'autoReplySent' => $ok2]);
exit;
