import { Headphones, PhoneCall, AudioLines, ArrowRight } from "lucide-react";

type IvrDemo = {
  title: string;
  description: string;
  script: string;
  src: string;
};

const demos: IvrDemo[] = [
  {
    title: "Male 1",
    description: "Male voice IVR demo (1).",
    script:
      "Professional IVR demo recording.",
    src: "/audio/ivr/Liam_CISDemo_IVR1.mp3"
  },
  {
    title: "Male 2",
    description: "Male voice IVR demo (2).",
    script: "Professional IVR demo recording.",
    src: "/audio/ivr/Liam_CISDemo_IVR2.mp3"
  },
  {
    title: "Female 1",
    description: "Female voice IVR demo (1).",
    script: "Professional IVR demo recording.",
    src: "/audio/ivr/Rachel_CISDemo_IVR1.mp3"
  },
  {
    title: "Female 2",
    description: "Female voice IVR demo (2).",
    script: "Professional IVR demo recording.",
    src: "/audio/ivr/Rachel_CISDemo_IVR2.mp3"
  },
  {
    title: "After Hours VM",
    description: "After-hours voicemail greeting.",
    script: "After-hours voicemail greeting.",
    src: "/audio/ivr/after-hours.mp3"
  }
];

export default function VoipIvr() {
  return (
    <section id="voip" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <PhoneCall className="w-4 h-4" />
            <span>VOIP & IVR Audio</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Professional IVR Messages</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your stack shouldn’t fight you—especially your phones.
            <br />
            Upgrade your call flow with clear, branded greetings and IVR prompts. Below are sample messages—swap
            in your own audio files anytime.
          </p>
        </div>

        {/* Demos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo) => (
            <div
              key={demo.title}
              className="group p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Headphones className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{demo.title}</h3>
                  <p className="text-muted-foreground">{demo.description}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-3">
                  <AudioLines className="w-4 h-4 text-primary" />
                  <span>Audio demo</span>
                </div>
                <audio controls preload="none" className="w-full">
                  <source src={demo.src} />
                </audio>
                <p className="mt-3 text-xs text-muted-foreground">
                  If audio doesn’t play locally, add MP3 files under <span className="font-mono">public/audio/ivr</span>.
                </p>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <div className="font-medium text-foreground mb-1">Script</div>
                <p>"{demo.script}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Get IVR Audio for Your Business
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            We can write scripts, record voice talent, and help implement your IVR flow.
          </p>
        </div>
      </div>
    </section>
  );
}

