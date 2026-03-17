import { useState, useEffect, useRef } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const SKILL_META = {
  Humour:       { emoji: "😄", color: "#6366F1", light: "#EEF2FF", dark: "#4338CA" },
  Empathy:      { emoji: "🤝", color: "#10B981", light: "#D1FAE5", dark: "#065F46" },
  Conflict:     { emoji: "⚖️",  color: "#F59E0B", light: "#FEF3C7", dark: "#92400E" },
  Listening:    { emoji: "👂", color: "#EC4899", light: "#FCE7F3", dark: "#9D174D" },
  Assertiveness:{ emoji: "💪", color: "#3B82F6", light: "#DBEAFE", dark: "#1E40AF" },
  Warmth:       { emoji: "🌟", color: "#F97316", light: "#FFF7ED", dark: "#9A3412" },
};

const DEFAULT_SCORES = { Humour: 42, Empathy: 61, Conflict: 33, Listening: 55, Assertiveness: 38, Warmth: 70 };

const TEST_QUESTIONS = [
  { skill:"Humour",  text:"When someone's joke doesn't land at a gathering, you usually...", options:[
    {text:"Stay quiet and smile politely",score:1},{text:"Try to build on it to save the moment",score:4},
    {text:"Laugh to keep things comfortable",score:3},{text:"Smoothly change the subject",score:2}]},
  { skill:"Humour",  text:"When nervous in a social situation you tend to...", options:[
    {text:"Make a self-deprecating joke",score:4},{text:"Stay quiet and observe",score:1},
    {text:"Ask others questions",score:3},{text:"Excuse yourself briefly",score:2}]},
  { skill:"Humour",  text:"A colleague trips and drops papers in a meeting. Your instinct:", options:[
    {text:"Immediately help them up",score:2},{text:"Make a gentle joke to ease the tension",score:4},
    {text:"Pretend not to notice",score:1},{text:"Help while saying something warm",score:3}]},
  { skill:"Humour",  text:"During a tense meeting you sense the room needs lightening. You...", options:[
    {text:"Stay serious — it's professional",score:1},{text:"Make a gentle, relevant observation",score:4},
    {text:"Crack a joke regardless of timing",score:2},{text:"Suggest a short break",score:3}]},
  { skill:"Empathy", text:"A friend is upset about something that seems minor to you. You...", options:[
    {text:"Explain why it's not that serious",score:1},{text:"Listen and ask what they're feeling",score:4},
    {text:"Share a similar story of your own",score:2},{text:"Offer practical advice immediately",score:3}]},
  { skill:"Empathy", text:"A stranger on the train looks visibly distressed. You...", options:[
    {text:"Ignore it — it's private",score:1},{text:"Make gentle eye contact and offer a smile",score:4},
    {text:"Ask directly if they're okay",score:3},{text:"Position nearby in case they need help",score:2}]},
  { skill:"Empathy", text:"When someone tells you bad news, your first response is usually...", options:[
    {text:"Suggest how they could fix it",score:2},{text:"Acknowledge how hard that must feel",score:4},
    {text:"Share a time you had something similar",score:3},{text:"Change subject to cheer them up",score:1}]},
  { skill:"Empathy", text:"Someone disagrees with your strongly-held opinion. You...", options:[
    {text:"Dismiss their view internally",score:1},{text:"Genuinely try to understand how they got there",score:4},
    {text:"Politely defend your position",score:3},{text:"Ask why they think that, but plan to argue back",score:2}]},
  { skill:"Conflict",text:"A colleague takes credit for your work in front of the boss. You...", options:[
    {text:"Say nothing to avoid drama",score:1},{text:"Calmly clarify your role in the work",score:4},
    {text:"Confront them angrily afterwards",score:2},{text:"Talk to them privately first",score:3}]},
  { skill:"Conflict",text:"You and a close friend disagree strongly on a decision. You...", options:[
    {text:"Give in to keep the peace",score:1},{text:"Understand their view before defending yours",score:4},
    {text:"Argue until one of you concedes",score:2},{text:"Agree to disagree and move on",score:3}]},
  { skill:"Conflict",text:"When someone raises their voice at you, you...", options:[
    {text:"Raise your voice back",score:2},{text:"Shut down and go quiet",score:1},
    {text:"Calmly say you'll talk when calmer",score:4},{text:"Explain your side more firmly",score:3}]},
  { skill:"Listening",text:"When someone tells a long story, you...", options:[
    {text:"Listen but plan what to say next",score:2},{text:"Fully focus and ask clarifying questions",score:4},
    {text:"Occasionally glance at your phone",score:1},{text:"Listen and nod, summarising at the end",score:3}]},
  { skill:"Listening",text:"In a group discussion you tend to...", options:[
    {text:"Speak frequently and drive conversation",score:1},{text:"Mostly listen and contribute key points",score:4},
    {text:"Wait for others to finish then share your view",score:3},{text:"Jump in when you have something to say",score:2}]},
  { skill:"Listening",text:"After a difficult conversation, you typically...", options:[
    {text:"Forget most of what was said",score:1},{text:"Remember key emotions and what mattered to them",score:4},
    {text:"Remember the facts but not the feelings",score:2},{text:"Write notes to remember",score:3}]},
  { skill:"Assertiveness",text:"A waiter brings the wrong order. You...", options:[
    {text:"Eat it anyway to avoid fuss",score:1},{text:"Politely but clearly ask for the right order",score:4},
    {text:"Complain to the manager",score:2},{text:"Mention it apologetically",score:3}]},
  { skill:"Assertiveness",text:"You're asked to take on more work than you can handle. You...", options:[
    {text:"Say yes and struggle through",score:1},{text:"Explain your capacity and propose alternatives",score:4},
    {text:"Say no without explanation",score:3},{text:"Agree then ask for help later",score:2}]},
  { skill:"Assertiveness",text:"In a group, someone continuously interrupts you. You...", options:[
    {text:"Stop talking and let them speak",score:1},{text:"Finish your sentence calmly and firmly",score:4},
    {text:"Get noticeably frustrated",score:2},{text:"Wait and try again later",score:3}]},
  { skill:"Warmth",  text:"When meeting someone new, you tend to...", options:[
    {text:"Wait for them to initiate conversation",score:1},{text:"Smile, introduce yourself, ask a question",score:4},
    {text:"Be polite but keep distance initially",score:2},{text:"Let conversation develop naturally",score:3}]},
  { skill:"Warmth",  text:"A colleague has had a hard day. You...", options:[
    {text:"Mind your own business",score:1},{text:"Check in and offer a kind word",score:4},
    {text:"Send them a message later",score:3},{text:"Offer to cover something for them",score:2}]},
  { skill:"Warmth",  text:"You receive a heartfelt message from a friend. You...", options:[
    {text:"Reply briefly with a thumbs up",score:1},{text:"Write a warm, thoughtful reply",score:4},
    {text:"Save it to reply later and forget",score:2},{text:"Call them to say thanks",score:3}]},
];

const EXERCISES = {
  Humour:[
    {id:"h1",title:"Witty comeback drill",duration:"5 min",level:1,
     situation:"Your friend spills coffee on your brand-new white shirt right before an important presentation.",
     options:[
       {text:"Well, I always wanted a tie-dye shirt!",correct:false},
       {text:"Perfect — now I look artsy AND late.",correct:true},
       {text:"Oh no, this shirt was really expensive!",correct:false},
       {text:"Don't worry about it, honestly it's fine.",correct:false},
     ],
     explanation:"Option B is a masterclass in self-deprecating humour. It acknowledges the problem with wit, avoids making your friend feel worse, and uses timing effectively. The 'AND late' addition stacks two problems comedically — this is called a 'topper' in comedy writing."},
    {id:"h2",title:"Tension breaker",duration:"5 min",level:2,
     situation:"A video call freezes at an awkward moment right when you're mid-sentence making a serious point.",
     options:[
       {text:"Hello? Can everyone still hear me?",correct:false},
       {text:"I'll just pretend that was dramatic effect.",correct:true},
       {text:"Sorry, my internet is terrible today.",correct:false},
       {text:"Should I drop and call back in?",correct:false},
     ],
     explanation:"Reframing a technical failure as 'dramatic effect' takes ownership of the moment and turns an awkward silence into a laugh. This is called 'reclaiming the narrative' — instead of apologising for something outside your control, you present it as intentional."},
    {id:"h3",title:"Self-deprecation balance",duration:"7 min",level:3,
     situation:"You confidently give someone directions and send them completely the wrong way. They come back confused.",
     options:[
       {text:"Sorry, I'm genuinely terrible with directions!",correct:false},
       {text:"I gave you the scenic route — you're welcome.",correct:true},
       {text:"I thought that was right, to be honest.",correct:false},
       {text:"Directions are tricky in this area.",correct:false},
     ],
     explanation:"The 'scenic route' response uses irony to acknowledge your mistake without over-apologising. It shows confidence and the ability to laugh at yourself — key components of social ease. The 'you're welcome' twist adds a bonus layer of playfulness."},
  ],
  Empathy:[
    {id:"e1",title:"Emotional validation drill",duration:"6 min",level:1,
     situation:"Your friend tells you they didn't get a promotion they'd been working towards for six months. They seem crushed.",
     options:[
       {text:"There'll definitely be other opportunities!",correct:false},
       {text:"That's genuinely gutting. How are you feeling?",correct:true},
       {text:"Maybe ask for feedback on what to improve.",correct:false},
       {text:"I'm sure you'll get it next time around.",correct:false},
     ],
     explanation:"Validating the emotion before moving to solutions is the cornerstone of empathy. 'Genuinely gutting' mirrors their feeling with weight, and the open question gives them space to feel heard rather than fixed. Advice without empathy often feels dismissive."},
    {id:"e2",title:"Reading between the lines",duration:"5 min",level:2,
     situation:"A colleague says 'I'm fine' but looks clearly exhausted and distracted during a team lunch.",
     options:[
       {text:"Good, glad you're fine!",correct:false},
       {text:"You seem a bit drained — I'm around if you need to talk.",correct:true},
       {text:"You really don't look fine, what's wrong?",correct:false},
       {text:"Long week?",correct:false},
     ],
     explanation:"Observing non-verbal cues and naming them gently shows you're paying attention beyond words. The offer to talk is open-ended and low-pressure — no forcing, no probing. This is called 'holding space' — making it safe without demanding entry."},
  ],
  Conflict:[
    {id:"c1",title:"De-escalation practice",duration:"8 min",level:2,
     situation:"Your flatmate raises their voice about dishes in the sink again. You didn't leave them this time.",
     options:[
       {text:"I didn't leave them! Don't shout at me!",correct:false},
       {text:"Let's calm down and work this out — those weren't mine.",correct:true},
       {text:"Fine, I'll just do all the dishes from now on.",correct:false},
       {text:"You're always like this, it's completely unfair.",correct:false},
     ],
     explanation:"Staying calm when wrongly accused is one of the hardest interpersonal skills. By separating 'calm down' (process) from 'those weren't mine' (fact), you de-escalate the emotion without conceding the point. Matching raised energy would spiral the conflict further."},
    {id:"c2",title:"Constructive disagreement",duration:"6 min",level:1,
     situation:"In a team meeting, a colleague proposes an idea you're fairly certain will not work.",
     options:[
       {text:"That won't work — I've seen it fail before.",correct:false},
       {text:"Interesting — what specific problem is that solving?",correct:true},
       {text:"I'd like to suggest a completely different approach.",correct:false},
       {text:"I have some concerns we should talk through.",correct:false},
     ],
     explanation:"Asking what problem an idea solves is deceptively powerful — it invites them to examine their own reasoning without putting them on the defensive. Often this question alone surfaces the flaw naturally, without conflict."},
  ],
  Listening:[
    {id:"l1",title:"Reflective listening",duration:"7 min",level:1,
     situation:"Your partner vents about a frustrating day at work, describing several problems with their manager.",
     options:[
       {text:"That sounds awful — maybe try talking to HR?",correct:false},
       {text:"So it sounds like you're feeling undervalued and undermined?",correct:true},
       {text:"I had a hard day too, let me tell you about it...",correct:false},
       {text:"Have you thought about looking for a new job?",correct:false},
     ],
     explanation:"Reflective listening means summarising the emotion, not the facts. 'Undervalued and undermined' captures the feeling beneath the story. This technique makes the speaker feel profoundly heard and often helps them process the situation themselves."},
    {id:"l2",title:"The pause practice",duration:"5 min",level:2,
     situation:"A friend shares exciting news about a life change. Before you respond, you notice your urge to immediately share your opinion.",
     options:[
       {text:"That's amazing! I actually think you should also consider...",correct:false},
       {text:"Wow — tell me more. How long have you been thinking about this?",correct:true},
       {text:"Congratulations! I had something similar happen to me...",correct:false},
       {text:"Are you sure that's a good idea?",correct:false},
     ],
     explanation:"The instinct to immediately offer advice or relate it to yourself is the enemy of deep listening. Asking 'tell me more' keeps the focus entirely on them and signals that their experience matters more than your reaction right now."},
  ],
  Assertiveness:[
    {id:"a1",title:"Boundary setting",duration:"5 min",level:1,
     situation:"Your manager asks you to stay late for the fifth time this week without checking if you're available.",
     options:[
       {text:"Okay sure, I can stay.",correct:false},
       {text:"I can stay today, but I'd like to flag this week has been challenging — can we discuss workload planning?",correct:true},
       {text:"I can't keep doing this every single night.",correct:false},
       {text:"I have plans tonight, sorry.",correct:false},
     ],
     explanation:"The ideal response does three things: agrees once (showing goodwill), names the pattern without accusation, and proposes a constructive next step. This is assertiveness without aggression — you state your need and offer a path forward simultaneously."},
  ],
  Warmth:[
    {id:"w1",title:"Genuine connection",duration:"5 min",level:1,
     situation:"You're introduced to a new team member on their first day. They look a little overwhelmed.",
     options:[
       {text:"Hi! Welcome. Let me know if you need anything.",correct:false},
       {text:"First days are a lot — I remember feeling exactly this way. What's surprised you most so far?",correct:true},
       {text:"Welcome! I'm sure you'll settle in quickly.",correct:false},
       {text:"Good to meet you. I'm heading to a meeting but let's chat later.",correct:false},
     ],
     explanation:"Sharing a relatable experience ('I remember feeling exactly this way') builds instant rapport and normalises their overwhelm. Following with a specific question shows genuine curiosity. This is the difference between polite warmth and real human connection."},
    {id:"w2",title:"Recognition and appreciation",duration:"4 min",level:1,
     situation:"A quiet team member who rarely gets praise has just done excellent work on a project.",
     options:[
       {text:"Good work on the project everyone.",correct:false},
       {text:"I noticed the detail in your work on this — it made a real difference. Thank you.",correct:true},
       {text:"The project went well, you all did great.",correct:false},
       {text:"Let me know if you need help on the next one.",correct:false},
     ],
     explanation:"Specific, personal recognition is exponentially more powerful than general praise. By naming what you noticed ('the detail in your work') you show you actually paid attention. This creates psychological safety and encourages continued contribution."},
  ],
};

const RESOURCES_DATA = {
  Humour:[
    {type:"book",title:"The Comic Toolbox",author:"John Vorhaus",desc:"Practical guide to writing and speaking with comic timing and confidence."},
    {type:"book",title:"Born Standing Up",author:"Steve Martin",desc:"A memoir about developing stage presence, wit, and authentic performance."},
    {type:"video",title:"The surprising secret to speaking with confidence",source:"TED Talk · Caroline Goyder",desc:"Using playfulness and breath to manage nerves and connect with any audience."},
    {type:"video",title:"What makes something funny?",source:"YouTube · Vsauce",desc:"A deep dive into the psychology and mechanics behind why we laugh."},
  ],
  Empathy:[
    {type:"book",title:"Daring Greatly",author:"Brené Brown",desc:"How vulnerability is the foundation of courage, creativity, and real connection."},
    {type:"book",title:"Nonviolent Communication",author:"Marshall Rosenberg",desc:"A revolutionary language framework for expressing and receiving empathy."},
    {type:"video",title:"The Power of Vulnerability",source:"TED Talk · Brené Brown",desc:"One of the most-watched talks in TED history on human connection."},
  ],
  Conflict:[
    {type:"book",title:"Crucial Conversations",author:"Patterson, Grenny et al.",desc:"Tools for talking when stakes are high and emotions run strong."},
    {type:"book",title:"Never Split the Difference",author:"Chris Voss",desc:"FBI negotiation techniques that work brilliantly in everyday conflict."},
    {type:"video",title:"How to have better political conversations",source:"TED Talk · Robb Willer",desc:"The surprising science of constructive disagreement across difference."},
  ],
  Listening:[
    {type:"book",title:"You're Not Listening",author:"Kate Murphy",desc:"Why we've lost the art of listening and why it matters more than ever."},
    {type:"video",title:"10 ways to have a better conversation",source:"TED Talk · Celeste Headlee",desc:"Practical skills for active listening in everyday life from a radio host."},
  ],
  Assertiveness:[
    {type:"book",title:"The Assertiveness Workbook",author:"Randy Paterson",desc:"A compassionate step-by-step guide to finding and using your voice."},
    {type:"book",title:"Set Boundaries, Find Peace",author:"Nedra Glennon Tawwab",desc:"A therapist's guide to reclaiming yourself through healthy boundaries."},
  ],
  Warmth:[
    {type:"book",title:"How to Win Friends and Influence People",author:"Dale Carnegie",desc:"The timeless classic guide to building genuine human relationships."},
    {type:"book",title:"The Art of Connection",author:"Michael J. Gelb",desc:"Seven relationship-building skills every leader needs to succeed."},
    {type:"video",title:"The art of being alone",source:"YouTube · Aperture",desc:"Understanding your relationship with yourself as the root of warmth toward others."},
  ],
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const BrainIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3L9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3l-2.46-.04Z"/>
  </svg>
);

function calcScoresFromAnswers(answers) {
  const totals = {};
  const counts = {};
  TEST_QUESTIONS.forEach((q, i) => {
    const s = q.skill;
    if (!totals[s]) { totals[s] = 0; counts[s] = 0; }
    totals[s] += answers[i] ?? 2;
    counts[s]++;
  });
  const result = {};
  Object.keys(totals).forEach(s => {
    result[s] = Math.round(((totals[s] / (counts[s] * 4)) * 100));
  });
  return result;
}

function LevelBadge({ level }) {
  const labels = ["", "Beginner", "Intermediate", "Advanced"];
  const colors = ["", "#10B981", "#F59E0B", "#EC4899"];
  const bgs = ["", "#D1FAE5", "#FEF3C7", "#FCE7F3"];
  return (
    <span style={{background:bgs[level],color:colors[level],fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:20}}>
      {labels[level]}
    </span>
  );
}

// ─────────────────────────────────────────────
// SCREEN: HOME
// ─────────────────────────────────────────────
function HomeScreen({ scores, completed, streak, onNavigate, onStartExercise }) {
  const sorted = Object.entries(scores).sort(([,a],[,b]) => a - b);
  const weakest = sorted.slice(0, 3);
  
  const todayExercises = weakest.map(([skill]) => {
    const exList = EXERCISES[skill] || [];
    return exList.find(e => !completed.has(e.id)) || exList[0];
  }).filter(Boolean);

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%)",padding:"48px 24px 32px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,marginBottom:4}}>Good morning 👋</p>
        <h1 style={{color:"#fff",fontSize:26,fontWeight:700,margin:"0 0 20px"}}>Ready to grow today?</h1>
        {/* Streak */}
        <div style={{background:"rgba(255,255,255,0.18)",borderRadius:16,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,background:"rgba(255,255,255,0.2)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⚡</div>
          <div>
            <p style={{color:"#fff",fontWeight:700,fontSize:16,margin:0}}>{streak}-day streak</p>
            <p style={{color:"rgba(255,255,255,0.7)",fontSize:12,margin:0}}>{completed.size} exercises completed total</p>
          </div>
          <div style={{marginLeft:"auto",background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"6px 12px",cursor:"pointer"}} onClick={() => onNavigate("test")}>
            <span style={{color:"#fff",fontSize:12,fontWeight:600}}>Retake test →</span>
          </div>
        </div>
      </div>

      <div style={{padding:"24px 20px"}}>
        {/* Skill summary */}
        <h2 style={{fontSize:16,fontWeight:700,color:"#1E1B4B",margin:"0 0 14px"}}>Your skill snapshot</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:28}}>
          {Object.entries(scores).map(([skill, val]) => {
            const m = SKILL_META[skill];
            return (
              <div key={skill} style={{background:"#fff",borderRadius:14,padding:"12px 10px",boxShadow:"0 1px 8px rgba(99,102,241,0.08)",border:"1px solid #F0EFFE",cursor:"pointer"}} onClick={() => onNavigate("train")}>
                <div style={{fontSize:18,marginBottom:4}}>{m.emoji}</div>
                <div style={{fontSize:10,color:"#6B7280",marginBottom:3,fontWeight:500}}>{skill}</div>
                <div style={{fontSize:18,fontWeight:700,color:m.color}}>{val}%</div>
                <div style={{background:"#F0EFFE",borderRadius:4,height:4,marginTop:5,overflow:"hidden"}}>
                  <div style={{width:`${val}%`,height:4,background:m.color,borderRadius:4,transition:"width 0.8s ease"}}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's exercises */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <h2 style={{fontSize:16,fontWeight:700,color:"#1E1B4B",margin:0}}>Today's focus</h2>
          <span style={{fontSize:12,color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={() => onNavigate("train")}>See all →</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {todayExercises.map(ex => {
            const skill = Object.keys(EXERCISES).find(s => EXERCISES[s].find(e => e.id === ex.id));
            const m = SKILL_META[skill];
            const done = completed.has(ex.id);
            return (
              <div key={ex.id} style={{background:"#fff",borderRadius:16,padding:"14px 16px",boxShadow:"0 1px 8px rgba(99,102,241,0.06)",border:`1px solid ${done ? m.light : "#F5F3FF"}`,display:"flex",alignItems:"center",gap:12,cursor:"pointer",opacity:done?0.7:1}} onClick={() => !done && onStartExercise(ex)}>
                <div style={{width:44,height:44,background:m.light,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                  {m.emoji}
                </div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontWeight:600,fontSize:14,color:"#1E1B4B"}}>{ex.title}</p>
                  <p style={{margin:"2px 0 0",fontSize:12,color:"#9CA3AF"}}>{skill} · {ex.duration}</p>
                </div>
                {done
                  ? <span style={{background:m.light,color:m.dark,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20}}>Done ✓</span>
                  : <div style={{width:32,height:32,background:m.color,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>→</div>
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: TEST
// ─────────────────────────────────────────────
function TestScreen({ onComplete, onBack }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const q = TEST_QUESTIONS[qIdx];
  const progress = ((qIdx) / TEST_QUESTIONS.length) * 100;

  function handleSelect(idx) {
    setSelected(idx);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = { ...answers, [qIdx]: q.options[selected].score };
    if (qIdx < TEST_QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setQIdx(qIdx + 1);
      setSelected(null);
    } else {
      onComplete(calcScoresFromAnswers(newAnswers));
    }
  }

  return (
    <div style={{minHeight:"100vh",background:"#F8F7FF",paddingBottom:80}}>
      {/* Header */}
      <div style={{background:"#fff",padding:"52px 20px 20px",borderBottom:"1px solid #F0EFFE"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <button onClick={onBack} style={{background:"#F0EFFE",border:"none",borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:16}}>←</button>
          <div style={{flex:1}}>
            <p style={{margin:0,fontSize:12,color:"#9CA3AF",fontWeight:500}}>Question {qIdx+1} of {TEST_QUESTIONS.length}</p>
          </div>
          <span style={{background:SKILL_META[q.skill].light,color:SKILL_META[q.skill].dark,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20}}>
            {SKILL_META[q.skill].emoji} {q.skill}
          </span>
        </div>
        {/* Progress bar */}
        <div style={{background:"#F0EFFE",borderRadius:8,height:6,overflow:"hidden"}}>
          <div style={{width:`${progress}%`,height:6,background:"linear-gradient(90deg,#6366F1,#8B5CF6)",borderRadius:8,transition:"width 0.4s ease"}}/>
        </div>
      </div>

      <div style={{padding:"28px 20px"}}>
        {/* Question */}
        <div style={{background:"linear-gradient(135deg,#6366F1,#8B5CF6)",borderRadius:20,padding:"24px 20px",marginBottom:28}}>
          <p style={{color:"#fff",fontSize:17,fontWeight:600,lineHeight:1.5,margin:0}}>{q.text}</p>
        </div>

        {/* Options */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(i)} style={{
              background: selected===i ? "#EEF2FF" : "#fff",
              border: selected===i ? "2px solid #6366F1" : "1.5px solid #E5E7EB",
              borderRadius:14, padding:"14px 16px", textAlign:"left", cursor:"pointer",
              fontSize:14, color: selected===i ? "#3730A3" : "#374151",
              fontWeight: selected===i ? 600 : 400,
              transition:"all 0.15s ease",
              transform: selected===i ? "scale(1.01)" : "scale(1)"
            }}>
              <span style={{display:"inline-block",width:22,height:22,borderRadius:"50%",background:selected===i?"#6366F1":"#F0EFFE",color:selected===i?"#fff":"#6366F1",fontSize:11,fontWeight:700,textAlign:"center",lineHeight:"22px",marginRight:10,flexShrink:0}}>
                {String.fromCharCode(65+i)}
              </span>
              {opt.text}
            </button>
          ))}
        </div>

        <button onClick={handleNext} disabled={selected===null} style={{
          width:"100%",padding:"16px",background: selected!==null ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "#E5E7EB",
          color: selected!==null ? "#fff" : "#9CA3AF",
          border:"none",borderRadius:16,fontSize:15,fontWeight:700,cursor:selected!==null?"pointer":"default",
          transition:"all 0.2s ease"
        }}>
          {qIdx < TEST_QUESTIONS.length - 1 ? "Next question →" : "See my results →"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: RESULTS
// ─────────────────────────────────────────────
function ResultsScreen({ scores, onNavigate }) {
  const radarData = Object.entries(scores).map(([skill, val]) => ({
    skill: skill.slice(0,5) + (skill.length > 5 ? "." : ""),
    fullSkill: skill,
    value: val,
    fullMark: 100,
  }));
  const sorted = Object.entries(scores).sort(([,a],[,b]) => a - b);
  const weakest = sorted.slice(0, 2);
  const strongest = sorted.slice(-2).reverse();

  return (
    <div style={{paddingBottom:80,background:"#F8F7FF",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#6366F1,#8B5CF6)",padding:"52px 24px 40px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,margin:"0 0 6px"}}>Test complete 🎉</p>
        <h1 style={{color:"#fff",fontSize:24,fontWeight:700,margin:"0 0 4px"}}>Your Interpersonal Profile</h1>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:14,margin:0}}>Based on your 20 answers</p>
      </div>

      <div style={{padding:"24px 20px"}}>
        {/* Radar chart */}
        <div style={{background:"#fff",borderRadius:20,padding:"20px",marginBottom:20,boxShadow:"0 2px 16px rgba(99,102,241,0.08)"}}>
          <h3 style={{fontSize:14,fontWeight:700,color:"#1E1B4B",margin:"0 0 4px"}}>Skill radar</h3>
          <p style={{fontSize:12,color:"#9CA3AF",margin:"0 0 16px"}}>Tap a section to explore exercises</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} margin={{top:10,right:30,bottom:10,left:30}}>
              <PolarGrid gridType="polygon" stroke="#E5E7EB"/>
              <PolarAngleAxis dataKey="skill" tick={{fontSize:11,fill:"#6B7280",fontWeight:600}}/>
              <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
              <Radar name="score" dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.18} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score breakdown */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
          {Object.entries(scores).map(([skill, val]) => {
            const m = SKILL_META[skill];
            return (
              <div key={skill} style={{background:"#fff",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 1px 6px rgba(99,102,241,0.05)"}}>
                <span style={{fontSize:20,width:32,textAlign:"center"}}>{m.emoji}</span>
                <span style={{flex:1,fontSize:14,fontWeight:600,color:"#1E1B4B"}}>{skill}</span>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:80,background:"#F0EFFE",borderRadius:6,height:6,overflow:"hidden"}}>
                    <div style={{width:`${val}%`,height:6,background:m.color,borderRadius:6}}/>
                  </div>
                  <span style={{fontSize:14,fontWeight:700,color:m.color,minWidth:36,textAlign:"right"}}>{val}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Focus areas */}
        <h3 style={{fontSize:16,fontWeight:700,color:"#1E1B4B",margin:"0 0 12px"}}>Suggested focus areas</h3>
        {weakest.map(([skill, val]) => {
          const m = SKILL_META[skill];
          const count = (EXERCISES[skill]||[]).length;
          return (
            <div key={skill} style={{background:m.light,borderRadius:16,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${m.light}`}} onClick={() => onNavigate("train")}>
              <div style={{width:44,height:44,background:"rgba(255,255,255,0.6)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{m.emoji}</div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontWeight:700,fontSize:14,color:m.dark}}>{skill}</p>
                <p style={{margin:"2px 0 0",fontSize:12,color:m.color}}>{count} exercises available · currently {val}%</p>
              </div>
              <div style={{background:m.color,borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:13,fontWeight:700}}>Train</div>
            </div>
          );
        })}

        <button onClick={() => onNavigate("home")} style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:700,cursor:"pointer",marginTop:8}}>
          Start training →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: TRAIN
// ─────────────────────────────────────────────
function TrainScreen({ scores, completed, onStartExercise }) {
  const [activeSkill, setActiveSkill] = useState("All");
  const allSkills = ["All", ...Object.keys(SKILL_META)];

  const allExercises = [];
  Object.entries(EXERCISES).forEach(([skill, exList]) => {
    exList.forEach(ex => allExercises.push({ ...ex, skill }));
  });

  const filtered = activeSkill === "All" ? allExercises : allExercises.filter(e => e.skill === activeSkill);
  const sorted = [...filtered].sort((a, b) => {
    const aDone = completed.has(a.id) ? 1 : 0;
    const bDone = completed.has(b.id) ? 1 : 0;
    return aDone - bDone;
  });

  return (
    <div style={{background:"#F8F7FF",minHeight:"100vh",paddingBottom:80}}>
      <div style={{background:"#fff",padding:"52px 20px 16px",borderBottom:"1px solid #F0EFFE"}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#1E1B4B",margin:"0 0 16px"}}>Training hub</h1>
        {/* Skill filter */}
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {allSkills.map(s => {
            const m = s !== "All" ? SKILL_META[s] : null;
            const active = activeSkill === s;
            return (
              <button key={s} onClick={() => setActiveSkill(s)} style={{
                background: active ? (m?.color || "#6366F1") : "#F0EFFE",
                color: active ? "#fff" : "#6B7280",
                border: "none", borderRadius: 20, padding: "7px 14px",
                fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                flexShrink: 0, transition: "all 0.15s"
              }}>
                {m ? m.emoji + " " : ""}{s}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{padding:"20px"}}>
        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",boxShadow:"0 1px 8px rgba(99,102,241,0.06)"}}>
            <p style={{margin:0,fontSize:11,color:"#9CA3AF",fontWeight:500}}>Completed</p>
            <p style={{margin:"4px 0 0",fontSize:22,fontWeight:700,color:"#6366F1"}}>{completed.size} / {allExercises.length}</p>
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",boxShadow:"0 1px 8px rgba(99,102,241,0.06)"}}>
            <p style={{margin:0,fontSize:11,color:"#9CA3AF",fontWeight:500}}>Avg. score</p>
            <p style={{margin:"4px 0 0",fontSize:22,fontWeight:700,color:"#10B981"}}>
              {Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.values(scores).length)}%
            </p>
          </div>
        </div>

        {sorted.map(ex => {
          const m = SKILL_META[ex.skill];
          const done = completed.has(ex.id);
          return (
            <div key={ex.id} onClick={() => !done && onStartExercise(ex)} style={{
              background:"#fff", borderRadius:16, padding:"16px", marginBottom:10,
              boxShadow:"0 1px 8px rgba(99,102,241,0.06)", cursor:done?"default":"pointer",
              opacity:done?0.65:1, border:`1.5px solid ${done?m.light:"transparent"}`,
              transition:"transform 0.1s", display:"flex", alignItems:"center", gap:12
            }}>
              <div style={{width:48,height:48,background:m.light,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                {m.emoji}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <p style={{margin:0,fontWeight:700,fontSize:14,color:"#1E1B4B"}}>{ex.title}</p>
                  <LevelBadge level={ex.level}/>
                </div>
                <p style={{margin:0,fontSize:12,color:"#9CA3AF"}}>{ex.skill} · {ex.duration}</p>
              </div>
              {done
                ? <span style={{background:m.light,color:m.dark,fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20}}>✓</span>
                : <div style={{width:36,height:36,background:m.color,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,flexShrink:0}}>→</div>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: EXERCISE
// ─────────────────────────────────────────────
function ExerciseScreen({ exercise, onComplete, onBack }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const skill = Object.keys(EXERCISES).find(s => EXERCISES[s].find(e => e.id === exercise.id));
  const m = SKILL_META[skill];

  async function handleSubmit() {
    if (selectedIdx === null) return;
    setSubmitted(true);
    const chosen = exercise.options[selectedIdx];
    setLoadingAI(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a warm, insightful interpersonal skills coach. A user is doing an exercise on the skill of "${skill}".

Situation: "${exercise.situation}"
The user chose: "${chosen.text}"
Is this the best answer: ${chosen.correct ? "YES" : "NO"}

Give encouraging, specific, 2-3 sentence feedback. Explain WHY this response works or doesn't work from an interpersonal psychology perspective. Be concrete. If it's not the best, gently explain what would be better. Be warm and encouraging, not clinical. Keep it to 2-3 sentences max.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || exercise.explanation;
      setAiFeedback(text);
    } catch {
      setAiFeedback(exercise.explanation);
    }
    setLoadingAI(false);
  }

  return (
    <div style={{background:"#F8F7FF",minHeight:"100vh",paddingBottom:80}}>
      {/* Header */}
      <div style={{background:m.color,padding:"48px 20px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:16,color:"#fff"}}>←</button>
          <div style={{flex:1}}>
            <p style={{margin:0,color:"rgba(255,255,255,0.75)",fontSize:12}}>{skill} exercise</p>
          </div>
          <LevelBadge level={exercise.level}/>
        </div>
        <h2 style={{color:"#fff",fontSize:20,fontWeight:700,margin:"0 0 4px"}}>{exercise.title}</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:0}}>{exercise.duration} · Pick the best response</p>
      </div>

      <div style={{padding:"24px 20px"}}>
        {/* Situation */}
        <div style={{background:"#fff",borderRadius:18,padding:"20px",marginBottom:20,boxShadow:"0 2px 12px rgba(99,102,241,0.08)",borderLeft:`4px solid ${m.color}`}}>
          <p style={{fontSize:11,fontWeight:700,color:m.color,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.06em"}}>The situation</p>
          <p style={{fontSize:15,color:"#1E1B4B",lineHeight:1.6,margin:0,fontStyle:"italic"}}>"{exercise.situation}"</p>
        </div>

        {/* Options */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {exercise.options.map((opt, i) => {
            let bg = "#fff", border = "1.5px solid #E5E7EB", textColor = "#374151", fontW = 400;
            if (selectedIdx === i && !submitted) {
              bg = m.light; border = `2px solid ${m.color}`; textColor = m.dark; fontW = 600;
            }
            if (submitted) {
              if (opt.correct) { bg = "#D1FAE5"; border = "2px solid #10B981"; textColor = "#065F46"; fontW = 700; }
              else if (selectedIdx === i && !opt.correct) { bg = "#FEF2F2"; border = "2px solid #EF4444"; textColor = "#991B1B"; }
            }
            return (
              <button key={i} onClick={() => !submitted && setSelectedIdx(i)} style={{
                background:bg, border, borderRadius:14, padding:"14px 16px",
                textAlign:"left", cursor:submitted?"default":"pointer",
                fontSize:14, color:textColor, fontWeight:fontW,
                transition:"all 0.15s ease", lineHeight:1.4
              }}>
                <span style={{display:"inline-block",width:22,height:22,borderRadius:"50%",background:submitted&&opt.correct?"#10B981":submitted&&selectedIdx===i&&!opt.correct?"#EF4444":selectedIdx===i&&!submitted?m.color:"#F0EFFE",color:"#fff",fontSize:11,fontWeight:700,textAlign:"center",lineHeight:"22px",marginRight:10}}>
                  {submitted && opt.correct ? "✓" : submitted && selectedIdx===i && !opt.correct ? "✗" : String.fromCharCode(65+i)}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Submit or Feedback */}
        {!submitted ? (
          <button onClick={handleSubmit} disabled={selectedIdx===null} style={{
            width:"100%", padding:"16px", background:selectedIdx!==null?m.color:"#E5E7EB",
            color:selectedIdx!==null?"#fff":"#9CA3AF",
            border:"none", borderRadius:16, fontSize:15, fontWeight:700,
            cursor:selectedIdx!==null?"pointer":"default", transition:"all 0.2s"
          }}>
            Submit answer
          </button>
        ) : (
          <div>
            {/* AI Feedback card */}
            <div style={{background:"#fff",borderRadius:18,padding:"18px",marginBottom:16,boxShadow:"0 2px 12px rgba(16,185,129,0.1)",borderLeft:"4px solid #10B981"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:28,height:28,background:"#D1FAE5",color:"#065F46",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <BrainIcon size={16} />
                </div>
                <p style={{margin:0,fontSize:12,fontWeight:700,color:"#065F46",textTransform:"uppercase",letterSpacing:"0.05em"}}>AI Coach Feedback</p>
              </div>
              {loadingAI ? (
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#10B981",animation:`bounce 1s ease-in-out ${i*0.15}s infinite`}}/>
                  ))}
                  <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
                </div>
              ) : (
                <p style={{margin:0,fontSize:14,color:"#374151",lineHeight:1.65}}>{aiFeedback}</p>
              )}
            </div>

            {/* Base explanation */}
            <div style={{background:m.light,borderRadius:16,padding:"14px 16px",marginBottom:16,border:`1px solid ${m.color}22`}}>
              <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:m.dark,textTransform:"uppercase",letterSpacing:"0.06em"}}>Key insight</p>
              <p style={{margin:0,fontSize:13,color:m.dark,lineHeight:1.6}}>{exercise.explanation}</p>
            </div>

            <button onClick={onComplete} style={{
              width:"100%", padding:"16px", background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
              color:"#fff", border:"none", borderRadius:16, fontSize:15, fontWeight:700, cursor:"pointer"
            }}>
              Complete exercise ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: RESOURCES
// ─────────────────────────────────────────────
function ResourcesScreen() {
  const [activeSkill, setActiveSkill] = useState("Humour");
  const resources = RESOURCES_DATA[activeSkill] || [];

  return (
    <div style={{background:"#F8F7FF",minHeight:"100vh",paddingBottom:80}}>
      <div style={{background:"#fff",padding:"52px 20px 16px",borderBottom:"1px solid #F0EFFE"}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#1E1B4B",margin:"0 0 4px"}}>Resource library</h1>
        <p style={{fontSize:13,color:"#9CA3AF",margin:"0 0 16px"}}>Curated books & videos by skill</p>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {Object.keys(SKILL_META).map(s => {
            const m = SKILL_META[s];
            const active = activeSkill === s;
            return (
              <button key={s} onClick={() => setActiveSkill(s)} style={{
                background:active?m.color:m.light,
                color:active?"#fff":m.dark,
                border:"none",borderRadius:20,padding:"7px 14px",
                fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0
              }}>
                {m.emoji} {s}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{padding:"20px"}}>
        {/* Skill insight card */}
        <div style={{background:`linear-gradient(135deg,${SKILL_META[activeSkill].color},${SKILL_META[activeSkill].color}CC)`,borderRadius:18,padding:"18px 20px",marginBottom:20,color:"#fff"}}>
          <p style={{fontSize:11,fontWeight:700,margin:"0 0 6px",opacity:0.8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Learning path</p>
          <p style={{fontSize:16,fontWeight:700,margin:"0 0 4px"}}>{activeSkill} skills</p>
          <p style={{fontSize:13,opacity:0.8,margin:0,lineHeight:1.5}}>
            {resources.length} resources · {resources.filter(r=>r.type==="book").length} books · {resources.filter(r=>r.type==="video").length} videos
          </p>
        </div>

        {resources.map((r, i) => (
          <div key={i} style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:10,boxShadow:"0 1px 8px rgba(99,102,241,0.06)",display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{
              width:44,height:44,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
              background:r.type==="book"?"#EEF2FF":"#FEF3C7"
            }}>
              {r.type === "book" ? "📚" : "▶️"}
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{
                  background:r.type==="book"?"#EEF2FF":"#FEF3C7",
                  color:r.type==="book"?"#4338CA":"#92400E",
                  fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,textTransform:"uppercase"
                }}>
                  {r.type}
                </span>
              </div>
              <p style={{margin:"0 0 3px",fontWeight:700,fontSize:14,color:"#1E1B4B"}}>{r.title}</p>
              <p style={{margin:"0 0 5px",fontSize:12,color:"#9CA3AF"}}>{r.author || r.source}</p>
              <p style={{margin:0,fontSize:13,color:"#6B7280",lineHeight:1.5}}>{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN: PROFILE
// ─────────────────────────────────────────────
function ProfileScreen({ scores, streak, completed, onNavigate }) {
  const radarData = Object.entries(scores).map(([skill, val]) => ({
    skill: skill.length > 5 ? skill.slice(0,4) + "." : skill,
    value: val,
    fullMark: 100,
  }));

  const avg = Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/6);

  const achievements = [
    { label: "First test", icon: "🧬", earned: true },
    { label: "3-day streak", icon: "🔥", earned: streak >= 3 },
    { label: "5 exercises", icon: "⚡", earned: completed.size >= 5 },
    { label: "All skills 50%+", icon: "🎯", earned: Object.values(scores).every(s => s >= 50) },
    { label: "7-day streak", icon: "💎", earned: streak >= 7 },
    { label: "All exercises", icon: "🏆", earned: completed.size >= Object.values(EXERCISES).flat().length },
  ];

  return (
    <div style={{background:"#F8F7FF",minHeight:"100vh",paddingBottom:80}}>
      {/* Profile header */}
      <div style={{background:"linear-gradient(135deg,#6366F1,#8B5CF6)",padding:"52px 24px 32px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{width:56,height:56,background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <BrainIcon size={28} />
          </div>
          <div>
            <h1 style={{color:"#fff",fontSize:20,fontWeight:700,margin:"0 0 2px"}}>Your Profile</h1>
            <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:0}}>Overall interpersonal score</p>
          </div>
          <div style={{marginLeft:"auto",textAlign:"right"}}>
            <p style={{color:"#fff",fontSize:28,fontWeight:800,margin:0}}>{avg}%</p>
            <p style={{color:"rgba(255,255,255,0.7)",fontSize:11,margin:0}}>avg. across all skills</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            {label:"Day streak",val:streak,icon:"⚡"},
            {label:"Exercises done",val:completed.size,icon:"✅"},
            {label:"Skills tracked",val:6,icon:"📊"},
          ].map(stat => (
            <div key={stat.label} style={{background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"10px 12px",textAlign:"center"}}>
              <p style={{color:"#fff",fontSize:18,fontWeight:800,margin:"0 0 2px"}}>{stat.val}</p>
              <p style={{color:"rgba(255,255,255,0.65)",fontSize:10,margin:0}}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"24px 20px"}}>
        {/* Radar */}
        <div style={{background:"#fff",borderRadius:20,padding:"20px",marginBottom:20,boxShadow:"0 2px 12px rgba(99,102,241,0.07)"}}>
          <h3 style={{fontSize:14,fontWeight:700,color:"#1E1B4B",margin:"0 0 16px"}}>Full skill radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{top:10,right:30,bottom:10,left:30}}>
              <PolarGrid gridType="polygon" stroke="#E5E7EB"/>
              <PolarAngleAxis dataKey="skill" tick={{fontSize:11,fill:"#6B7280",fontWeight:600}}/>
              <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
              <Radar dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.18} strokeWidth={2}/>
              <Tooltip formatter={(v) => [`${v}%`, "Score"]}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed skill list */}
        <h3 style={{fontSize:16,fontWeight:700,color:"#1E1B4B",margin:"0 0 12px"}}>Skill breakdown</h3>
        <div style={{background:"#fff",borderRadius:18,overflow:"hidden",marginBottom:20,boxShadow:"0 1px 8px rgba(99,102,241,0.06)"}}>
          {Object.entries(scores).map(([skill, val], i, arr) => {
            const m = SKILL_META[skill];
            return (
              <div key={skill} style={{padding:"14px 16px",borderBottom:i<arr.length-1?"1px solid #F5F3FF":"none",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:20,width:28}}>{m.emoji}</span>
                <span style={{flex:1,fontSize:14,fontWeight:600,color:"#1E1B4B"}}>{skill}</span>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:72,background:"#F0EFFE",borderRadius:6,height:6,overflow:"hidden"}}>
                    <div style={{width:`${val}%`,height:6,background:m.color,borderRadius:6}}/>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:m.color,minWidth:36,textAlign:"right"}}>{val}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <h3 style={{fontSize:16,fontWeight:700,color:"#1E1B4B",margin:"0 0 12px"}}>Achievements</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {achievements.map(a => (
            <div key={a.label} style={{background:a.earned?"#fff":"#F9FAFB",borderRadius:14,padding:"14px 10px",textAlign:"center",border:a.earned?"1px solid #E5E7EB":"1px solid transparent",opacity:a.earned?1:0.45}}>
              <div style={{fontSize:24,marginBottom:6}}>{a.icon}</div>
              <p style={{margin:0,fontSize:11,fontWeight:600,color:a.earned?"#1E1B4B":"#9CA3AF"}}>{a.label}</p>
            </div>
          ))}
        </div>

        <button onClick={() => onNavigate("test")} style={{
          width:"100%",padding:"16px",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
          color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:700,cursor:"pointer"
        }}>
          Retake personality test →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  {id:"home",  label:"Home",      icon:"⊙"},
  {id:"train", label:"Train",     icon:"⚡"},
  {id:"test",  label:"Test",      icon:"◈"},
  {id:"resources",label:"Learn",  icon:"📚"},
  {id:"profile",label:"Profile",  icon:"◯"},
];

function BottomNav({ active, onNavigate }) {
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1px solid #F0EFFE",display:"flex",padding:"8px 0 20px",zIndex:100,boxShadow:"0 -2px 20px rgba(99,102,241,0.08)"}}>
      {NAV_ITEMS.map(tab => (
        <button key={tab.id} onClick={() => onNavigate(tab.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0"}}>
          <span style={{fontSize:18,opacity:active===tab.id?1:0.6,transition:"opacity 0.15s",color:active===tab.id?"#4338CA":"#4B5563"}}>{tab.icon}</span>
          <span style={{fontSize:11,color:active===tab.id?"#4338CA":"#4B5563",fontWeight:active===tab.id?700:600,transition:"color 0.15s"}}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────
function OnboardingScreen({ onComplete, isReturningUser }) {
  const [step, setStep] = useState(0);
  let steps = [
    {icon:<BrainIcon size={72} color="#6366F1" />,title:"Welcome to MindGrow",desc:"Your personal coach for mental wellbeing and interpersonal skills. Science-backed, AI-powered."},
    {icon:<span style={{fontSize:72}}>🎯</span>,title:"Take a personality test",desc:"A 20-question assessment maps your strengths and growth areas across 6 interpersonal skills."},
    {icon:<span style={{fontSize:72}}>⚡</span>,title:"Train every day",desc:"Bite-sized exercises personalised to your profile. Real-world scenarios, instant AI feedback."},
    {icon:<span style={{fontSize:72}}>📈</span>,title:"Track your growth",desc:"Watch your skill radar expand over time. Retake the test anytime to see your progress."},
  ];
  
  if (isReturningUser) {
    steps = [steps[0]];
  }

  const s = steps[step];
  return (
    <div style={{minHeight:"100vh",background:"#F8F7FF",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",textAlign:"center"}}>
      <div style={{marginBottom:24,display:"flex",justifyContent:"center",alignItems:"center",height:80}}>{s.icon}</div>
      <div style={{display:"flex",gap:6,marginBottom:32}}>
        {steps.map((_,i) => (
          <div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i===step?"#6366F1":"#E5E7EB",transition:"width 0.3s"}}/>
        ))}
      </div>
      <h1 style={{fontSize:26,fontWeight:800,color:"#1E1B4B",margin:"0 0 12px",lineHeight:1.2}}>{s.title}</h1>
      <p style={{fontSize:16,color:"#6B7280",lineHeight:1.6,margin:"0 0 48px",maxWidth:300}}>{s.desc}</p>
      <button onClick={() => step < steps.length-1 ? setStep(step+1) : onComplete()} style={{
        width:"100%",padding:"18px",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",
        border:"none",borderRadius:18,fontSize:16,fontWeight:700,cursor:"pointer",maxWidth:340
      }}>
        {step < steps.length-1 ? "Continue →" : "Get started →"}
      </button>
      {step > 0 && <button onClick={() => setStep(step-1)} style={{background:"none",border:"none",color:"#9CA3AF",fontSize:14,cursor:"pointer",marginTop:16}}>← Back</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("mindgrow_onboarded") === "true");
  const [screen, setScreen] = useState("home");
  const [prevScreen, setPrevScreen] = useState("home");
  const [scores, setScores] = useState(DEFAULT_SCORES);
  const [completed, setCompleted] = useState(new Set());
  const [streak] = useState(7);
  const [currentExercise, setCurrentExercise] = useState(null);

  function navigate(s) {
    setPrevScreen(screen);
    setScreen(s);
  }

  function handleTestComplete(newScores) {
    setScores(newScores);
    navigate("results");
  }

  function handleStartExercise(ex) {
    setCurrentExercise(ex);
    navigate("exercise");
  }

  function handleExerciseDone() {
    if (currentExercise) {
      setCompleted(prev => new Set([...prev, currentExercise.id]));
    }
    navigate("train");
  }

  function handleOnboardingComplete() {
    localStorage.setItem("mindgrow_onboarded", "true");
    setOnboarded(true);
    setWelcomeShown(true);
  }

  if (!welcomeShown) {
    return (
      <div style={{maxWidth:430,margin:"0 auto",position:"relative",minHeight:"100vh"}}>
        <OnboardingScreen onComplete={handleOnboardingComplete} isReturningUser={onboarded} />
      </div>
    );
  }

  const showNav = !["exercise","test","results"].includes(screen);

  return (
    <div style={{maxWidth:430,margin:"0 auto",position:"relative",minHeight:"100vh",background:"#F8F7FF"}}>
      {screen === "home" && <HomeScreen scores={scores} completed={completed} streak={streak} onNavigate={navigate} onStartExercise={handleStartExercise}/>}
      {screen === "test" && <TestScreen onComplete={handleTestComplete} onBack={() => navigate(prevScreen)}/>}
      {screen === "results" && <ResultsScreen scores={scores} onNavigate={navigate}/>}
      {screen === "train" && <TrainScreen scores={scores} completed={completed} onStartExercise={handleStartExercise}/>}
      {screen === "exercise" && currentExercise && <ExerciseScreen exercise={currentExercise} onComplete={handleExerciseDone} onBack={() => navigate("train")}/>}
      {screen === "resources" && <ResourcesScreen/>}
      {screen === "profile" && <ProfileScreen scores={scores} streak={streak} completed={completed} onNavigate={navigate}/>}
      {showNav && <BottomNav active={screen} onNavigate={navigate}/>}
    </div>
  );
}
