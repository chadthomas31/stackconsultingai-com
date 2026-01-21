import { PlayCircle, Film, ExternalLink, ArrowRight } from "lucide-react";

type VideoDemo = {
  title: string;
  client: string;
  description: string;
  url: string;
};

const videos: VideoDemo[] = [
  {
    title: "Doodly Explainer Demo",
    client: "Elevance Financial",
    description: "Animated explainer video (hosted on Cloudflare CDN).",
    url: "https://pub-839f69762f974efeb3875c1e059eebce.r2.dev"
  },
  {
    title: "Doodly Explainer Demo",
    client: "Continental Interior Services",
    description: "Animated explainer video (hosted on Cloudflare CDN).",
    url: "https://pub-c5eedf881b8347bba2035fa85112690d.r2.dev"
  }
];

export default function DoodlyVideos() {
  return (
    <section id="videos" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Film className="w-4 h-4" />
            <span>Video Demos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Doodly Explainer Videos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Quick, clear explainers that turn complicated offers into simple stories—hosted on Cloudflare CDN for
            fast playback.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video.url}
              className="group p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{video.client}</h3>
                    <p className="text-muted-foreground">{video.description}</p>
                  </div>
                </div>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`Open ${video.client} video demo`}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              {/* Responsive embed */}
              <div className="rounded-xl overflow-hidden border border-border bg-background">
                <div className="relative w-full pt-[56.25%]">
                  <iframe
                    src={video.url}
                    title={`${video.client} video demo`}
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    allow="autoplay; fullscreen; picture-in-picture"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  If the embed doesn’t load, open it in a new tab.
                </div>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  View Demo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

