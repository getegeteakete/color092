import { Link } from "react-router-dom";
import { ChevronRight, Paintbrush, Hammer } from "lucide-react";
import paintingWork from "@/assets/painting-work.jpg";
import reformInterior from "@/assets/reform-interior.jpg";

const services = [
  {
    id: "coating",
    icon: Paintbrush,
    title: "塗装",
    description:
      "住宅や施設の外壁・内装から車体塗装まで幅広く対応しています。建物や車体の素材やデザインに合わせた最適なプランをご提案し、プロの職人が細部まで丁寧に施工します。",
    image: paintingWork,
    link: "/service#service-coating",
    worksLink: "/works?type=1",
  },
  {
    id: "reform",
    icon: Hammer,
    title: "リフォーム",
    description:
      "内装・外装問わず、お客様のご要望やスタイルに合わせた最適なプランをご提案し、使い勝手やデザイン性を向上させるリフォームを行っています。古くなった設備の交換から、間取りの変更、外観のリニューアルまで幅広く対応可能です。",
    image: reformInterior,
    link: "/service#service-reform",
    worksLink: "/works?type=2",
  },
];

export const ServiceSection = () => {
  return (
    <section className="bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="section-label">Service</span>
          <h2 className="section-title">事業内容</h2>
        </div>

        <div className="space-y-24">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    index % 2 === 0
                      ? "from-pink/20 to-transparent"
                      : "from-accent/20 to-transparent"
                  } rounded-3xl transform ${
                    index % 2 === 0 ? "-rotate-3" : "rotate-3"
                  }`}
                />
                <img
                  src={service.image}
                  alt={service.title}
                  className="relative rounded-3xl shadow-xl w-full h-80 object-cover"
                />
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink to-accent flex items-center justify-center">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to={service.link}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                  >
                    詳しくみる
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to={service.worksLink}
                    className="inline-flex items-center gap-2 text-muted-foreground font-medium hover:text-primary transition-colors"
                  >
                    施工実績を見る
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
