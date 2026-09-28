let context: AudioContext | null = null;
export function playNote(hz = 1000, duration = .045) {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();
  const oscillator = context.createOscillator(); const filter = context.createBiquadFilter(); const gain = context.createGain(); const now = context.currentTime;
  oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(hz, now); oscillator.frequency.exponentialRampToValueAtTime(hz * .8, now + duration);
  filter.type = 'lowpass'; filter.frequency.value = 3000; filter.Q.value = .7;
  gain.gain.setValueAtTime(.15, now); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  oscillator.connect(filter).connect(gain).connect(context.destination); oscillator.start(now); oscillator.stop(now + duration);
}
export function playShutter() {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();
  const sampleCount = Math.round(context.sampleRate * .1);
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i=0;i<data.length;i++) data[i]=Math.random()*2-1;
  for (const [offset,high,band,q,pan] of [[0,5000,7500,3.5,-.08],[.045,6000,6000,3,.08]]) {
    const source=context.createBufferSource(),hp=context.createBiquadFilter(),bp=context.createBiquadFilter(),stereo=context.createStereoPanner(),gain=context.createGain();
    source.buffer=buffer;hp.type='highpass';hp.frequency.value=high;bp.type='bandpass';bp.frequency.value=band;bp.Q.value=q;stereo.pan.value=pan;
    const now=context.currentTime+offset;gain.gain.setValueAtTime(.08,now);gain.gain.exponentialRampToValueAtTime(.0001,now+.045);
    source.connect(hp).connect(bp).connect(stereo).connect(gain).connect(context.destination);source.start(now);source.stop(now+.05);
  }
  const oscillator=context.createOscillator(),gain=context.createGain(),now=context.currentTime;
  oscillator.type='sine';oscillator.frequency.setValueAtTime(300,now);oscillator.frequency.exponentialRampToValueAtTime(90,now+.045);
  gain.gain.setValueAtTime(.035,now);gain.gain.exponentialRampToValueAtTime(.0001,now+.045);
  oscillator.connect(gain).connect(context.destination);oscillator.start(now);oscillator.stop(now+.045);
}
