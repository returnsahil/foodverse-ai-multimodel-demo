import { useEffect, useMemo, useRef, useState } from "react";
import {
  Apple,
  ArrowRight,
  Bell,
  Camera,
  Check,
  ChefHat,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Flame,
  HeartPulse,
  Leaf,
  Menu,
  Mic,
  Play,
  Plus,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Upload,
  UtensilsCrossed,
  Video,
  WandSparkles,
  X,
} from "lucide-react";
import {
  analyzeFood,
  analyzeHygiene,
  createMealPlan,
  createRecipe,
} from "./api";
import type {
  FoodAnalysis,
  HygieneAnalysis,
  MealPlan,
  Recipe,
  View,
} from "./types";

const fallbackAnalysis: FoodAnalysis = {
  dish: "Mediterranean harvest bowl",
  confidence: 0.94,
  items: [
    { name: "Leafy greens", confidence: 0.96, portion: "2 cups" },
    { name: "Roasted chickpeas", confidence: 0.92, portion: "¾ cup" },
    { name: "Cherry tomatoes", confidence: 0.89, portion: "½ cup" },
    { name: "Avocado", confidence: 0.86, portion: "½ medium" },
  ],
  nutrition: { calories: 428, protein: 18, carbs: 49, fat: 19, fiber: 12 },
  health_score: 88,
  freshness: "Fresh",
  freshness_confidence: 0.93,
  insights: [
    "High in fiber and plant protein",
    "Good balance of complex carbs and healthy fats",
    "Sodium appears moderate; dressing quantity can change the estimate",
  ],
};

const navItems: { id: View; label: string; icon: typeof Apple }[] = [
  { id: "overview", label: "Overview", icon: Sprout },
  { id: "analyze", label: "Food analyzer", icon: ScanLine },
  { id: "freshness", label: "Freshness check", icon: Leaf },
  { id: "hygiene", label: "Kitchen hygiene", icon: ShieldCheck },
  { id: "cook", label: "Cooking assistant", icon: ChefHat },
  { id: "meal-plan", label: "Meal planner", icon: Apple },
];

function App() {
  const [view, setView] = useState<View>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = (next: View) => {
    setView(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <button
          className="mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <button className="brand" onClick={() => navigate("overview")}>
          <span className="brand-mark">
            <Leaf size={20} fill="currentColor" />
          </span>
          <span>
            foodverse<span className="brand-dot">.</span>
          </span>
        </button>
        <p className="nav-label">Workspace</p>
        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${view === id ? "active" : ""}`}
              onClick={() => navigate(id)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="spark">
              <Sparkles size={15} />
            </span>
            <strong>Daily insight</strong>
            <p>You’re 18g away from today’s protein goal.</p>
            <button onClick={() => navigate("meal-plan")}>
              View plan <ArrowRight size={14} />
            </button>
          </div>
          <button className="profile-row">
            <span className="avatar">AM</span>
            <span>
              <strong>Alex Morgan</strong>
              <small>Personal plan</small>
            </span>
            <ChevronRight size={17} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="search">
            <Search size={18} />
            <input
              aria-label="Search"
              placeholder="Search foods, recipes, or insights..."
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <button
              className="icon-button"
              onClick={() => setToast("You’re all caught up.")}
              aria-label="Notifications"
            >
              <Bell size={19} />
              <i />
            </button>
            <button className="ask-button" onClick={() => navigate("cook")}>
              <WandSparkles size={17} /> Ask FoodVerse
            </button>
          </div>
        </header>

        <section className="page-wrap">
          {view === "overview" && <Overview navigate={navigate} />}
          {(view === "analyze" || view === "freshness") && (
            <FoodAnalyzer focus={view} />
          )}
          {view === "hygiene" && <HygieneMonitor />}
          {view === "cook" && <CookingAssistant />}
          {view === "meal-plan" && <MealPlanner />}
        </section>
      </main>
      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Overview({ navigate }: { navigate: (v: View) => void }) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">Sunday, 25 October</p>
          <h1>
            Good morning, Alex <span>✦</span>
          </h1>
          <p>What would you like to understand about your food today?</p>
        </div>
        <button className="primary-action" onClick={() => navigate("analyze")}>
          <Camera size={18} /> Analyze a meal
        </button>
      </div>

      <button className="daily-nudge" onClick={() => navigate("cook")}>
        <span className="daily-nudge-icon"><Sparkles size={14} /></span>
        <span><b>Small win for today</b> Make your next meal 1 color more vibrant.</span>
        <ArrowRight size={15} />
      </button>

      <div className="hero-grid">
        <button className="hero-analyze" onClick={() => navigate("analyze")}>
          <div className="hero-copy">
            <span className="live-pill">
              <i /> AI VISION READY
            </span>
            <h2>
              Point. Snap.
              <br />
              <em>Know your food.</em>
            </h2>
            <p>
              Instant recognition, nutrition, and freshness insights from a
              single photo.
            </p>
            <span className="round-arrow">
              <ArrowRight size={22} />
            </span>
          </div>
          <div className="plate-art" aria-hidden="true">
            <div className="plate">
              <span className="avocado">◒</span>
              <span className="tomato t1" />
              <span className="tomato t2" />
              <span className="greens">☘</span>
              <span className="grains">•••••</span>
            </div>
            <div className="scan-corner c1" />
            <div className="scan-corner c2" />
            <span className="recognition-tag">
              <Check size={12} /> 94% recognized
            </span>
          </div>
        </button>

        <div className="nutrition-card">
          <div className="card-heading">
            <div>
              <span className="mini-label">TODAY’S NUTRITION</span>
              <h3>
                1,426 <small>/ 2,000 kcal</small>
              </h3>
            </div>
            <button>
              Weekly <ChevronRight size={14} />
            </button>
          </div>
          <div className="calorie-track">
            <span style={{ width: "71%" }} />
          </div>
          <div className="macro-row">
            <Macro color="coral" value="74g" label="Protein" pct={74} />
            <Macro color="gold" value="168g" label="Carbs" pct={61} />
            <Macro color="green" value="48g" label="Fats" pct={66} />
          </div>
          <div className="health-row">
            <span className="health-ring">86</span>
            <span>
              <strong>Great balance today</strong>
              <small>Fiber and protein are right on track.</small>
            </span>
            <Sparkles size={18} />
          </div>
        </div>
      </div>

      <div className="section-title">
        <div>
          <span className="mini-label">EXPLORE FOODVERSE</span>
          <h2>One intelligence. Every food moment.</h2>
        </div>
        <p>
          From market freshness to kitchen safety, your food has a story. We
          help you read it.
        </p>
      </div>
      <div className="feature-grid">
        <FeatureCard
          icon={Leaf}
          tone="mint"
          title="Check freshness"
          text="See beyond the surface"
          meta="Color · Texture · Quality"
          onClick={() => navigate("freshness")}
          art="fresh"
        />
        <FeatureCard
          icon={ShieldCheck}
          tone="cream"
          title="Kitchen hygiene"
          text="Make every frame count"
          meta="Gloves · Hair caps · Surfaces"
          onClick={() => navigate("hygiene")}
          art="hygiene"
        />
        <FeatureCard
          icon={ChefHat}
          tone="peach"
          title="Cook with confidence"
          text="Guidance that adapts to you"
          meta="Recipes · Voice · Live help"
          onClick={() => navigate("cook")}
          art="cook"
        />
        <FeatureCard
          icon={Apple}
          tone="lilac"
          title="Plan around you"
          text="Meals made personal"
          meta="Goals · Preferences · Habits"
          onClick={() => navigate("meal-plan")}
          art="plan"
        />
      </div>

      <div className="insight-strip">
        <div className="insight-icon">
          <HeartPulse size={21} />
        </div>
        <div>
          <span className="mini-label">PERSONAL INSIGHT</span>
          <strong>Your lunches are getting more balanced</strong>
          <p>
            You’ve added 23% more vegetables this week. Small shifts, lasting
            change.
          </p>
        </div>
        <div className="week-bars">
          <i style={{ height: "35%" }} />
          <i style={{ height: "48%" }} />
          <i style={{ height: "42%" }} />
          <i style={{ height: "64%" }} />
          <i style={{ height: "76%" }} />
          <i style={{ height: "85%" }} />
          <i className="today" style={{ height: "94%" }} />
        </div>
        <button onClick={() => navigate("meal-plan")}>
          See your progress <ArrowRight size={15} />
        </button>
      </div>
    </>
  );
}

function Macro({
  color,
  value,
  label,
  pct,
}: {
  color: string;
  value: string;
  label: string;
  pct: number;
}) {
  return (
    <div className="macro">
      <div
        className={`macro-ring ${color}`}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      >
        <span>{value}</span>
      </div>
      <small>{label}</small>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  tone,
  title,
  text,
  meta,
  onClick,
  art,
}: {
  icon: typeof Leaf;
  tone: string;
  title: string;
  text: string;
  meta: string;
  onClick: () => void;
  art: string;
}) {
  return (
    <button className={`feature-card ${tone}`} onClick={onClick}>
      <div className="feature-top">
        <span className="feature-icon">
          <Icon size={19} />
        </span>
        <span className="tiny-arrow">
          <ArrowRight size={16} />
        </span>
      </div>
      <div className={`feature-art ${art}`}>
        <i />
        <b />
        <em />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
        <small>{meta}</small>
      </div>
    </button>
  );
}

function FoodAnalyzer({ focus }: { focus: "analyze" | "freshness" }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const choose = (next?: File) => {
    if (!next) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setAnalysis(null);
    setError("");
  };
  const run = async () => {
    if (!file) return inputRef.current?.click();
    setLoading(true);
    setError("");
    try {
      setAnalysis(await analyzeFood(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setAnalysis(fallbackAnalysis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page">
      <div className="page-heading">
        <div>
          <span className="mini-label">VISION INTELLIGENCE</span>
          <h1>
            {focus === "freshness"
              ? "Is it still fresh?"
              : "Understand what’s on your plate."}
          </h1>
          <p>
            {focus === "freshness"
              ? "Upload a clear photo and we’ll inspect color, texture, and visual quality signals."
              : "Upload a meal photo for recognition, nutrition estimates, and clear next steps."}
          </p>
        </div>
        <span className="model-pill">
          <Sparkles size={15} /> FoodVision v2.4
        </span>
      </div>
      <div className="analyzer-layout">
        <div className="upload-panel">
          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => choose(e.target.files?.[0])}
          />
          <div
            className={`drop-zone ${preview ? "has-preview" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              choose(e.dataTransfer.files[0]);
            }}
          >
            {preview ? (
              <img src={preview} alt="Selected food" />
            ) : (
              <>
                <span className="upload-icon">
                  <Upload size={25} />
                </span>
                <h3>Drop your food photo here</h3>
                <p>or click to browse · JPG, PNG, HEIC up to 10 MB</p>
                <span className="outline-button">
                  <Camera size={17} /> Choose photo
                </span>
              </>
            )}
            {preview && (
              <span className="replace-photo">Click to replace photo</span>
            )}
          </div>
          <button className="analyze-button" disabled={loading} onClick={run}>
            {loading ? (
              <>
                <span className="spinner" /> Reading visual signals...
              </>
            ) : (
              <>
                <ScanLine size={19} /> Analyze food <ArrowRight size={17} />
              </>
            )}
          </button>
          {error && (
            <p className="soft-error">
              Demo result shown — connect the FastAPI server for live analysis.
            </p>
          )}
          <div className="privacy-note">
            <ShieldCheck size={16} />
            <span>
              <strong>Your images stay yours.</strong> Processed securely and
              never used for training without consent.
            </span>
          </div>
        </div>
        <div className={`result-panel ${analysis ? "filled" : ""}`}>
          {!analysis ? (
            <div className="empty-result">
              <div className="orb">
                <Sparkles size={25} />
              </div>
              <h3>Your insights will appear here</h3>
              <p>
                Food recognition, nutritional estimates, freshness, and
                recommendations — all in one clear view.
              </p>
              <div className="empty-chips">
                <span>Recognition</span>
                <span>Nutrition</span>
                <span>Freshness</span>
              </div>
            </div>
          ) : (
            <AnalysisResult data={analysis} focus={focus} />
          )}
        </div>
      </div>
    </div>
  );
}

function AnalysisResult({
  data,
  focus,
}: {
  data: FoodAnalysis;
  focus: string;
}) {
  return (
    <div className="analysis-result">
      <div className="result-title">
        <div>
          <span className="mini-label">WE FOUND</span>
          <h2>{data.dish}</h2>
          <p>{Math.round(data.confidence * 100)}% visual confidence</p>
        </div>
        <span className="health-score">
          <b>{data.health_score}</b>
          <small>
            Health
            <br />
            score
          </small>
        </span>
      </div>
      <div className="fresh-banner">
        <span className="fresh-icon">
          <Leaf size={20} />
        </span>
        <div>
          <small>FRESHNESS</small>
          <strong>{data.freshness}</strong>
        </div>
        <span>{Math.round(data.freshness_confidence * 100)}% confidence</span>
      </div>
      {focus !== "freshness" && (
        <>
          <div className="nutrition-grid">
            <div className="calorie-box">
              <Flame size={18} />
              <strong>{data.nutrition.calories}</strong>
              <small>estimated kcal</small>
            </div>
            <Nutrient value={`${data.nutrition.protein}g`} label="Protein" />
            <Nutrient value={`${data.nutrition.carbs}g`} label="Carbs" />
            <Nutrient value={`${data.nutrition.fat}g`} label="Fat" />
          </div>
          <h4 className="subhead">What we recognized</h4>
          <div className="recognized-list">
            {data.items.map((item) => (
              <div key={item.name}>
                <span>
                  <i />
                  {item.name}
                </span>
                <small>{item.portion}</small>
                <b>{Math.round(item.confidence * 100)}%</b>
              </div>
            ))}
          </div>
        </>
      )}
      <h4 className="subhead">Smart takeaways</h4>
      <ul className="takeaways">
        {data.insights.map((item) => (
          <li key={item}>
            <Check size={14} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Nutrient({ value, label }: { value: string; label: string }) {
  return (
    <div className="nutrient">
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

function HygieneMonitor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<HygieneAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const run = async () => {
    if (!file) return inputRef.current?.click();
    setLoading(true);
    try {
      setResult(await analyzeHygiene(file));
    } catch {
      setResult({
        score: 86,
        status: "Good",
        duration: "00:42",
        checks: [
          { label: "Glove usage", score: 94, status: "Pass" },
          { label: "Hair restraint", score: 88, status: "Pass" },
          { label: "Surface cleanliness", score: 82, status: "Review" },
          { label: "Safe food handling", score: 91, status: "Pass" },
        ],
        alerts: [
          {
            time: "00:31",
            message: "Wipe preparation surface before the next task.",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="tool-page">
      <div className="page-heading">
        <div>
          <span className="mini-label">FOOD SAFETY VISION</span>
          <h1>Turn kitchen footage into safer habits.</h1>
          <p>
            Review glove use, hair restraints, handling practices, and surface
            cleanliness.
          </p>
        </div>
        <span className="model-pill">
          <i className="pulse-dot" /> Live-capable
        </span>
      </div>
      <div className="hygiene-layout">
        <div className="video-card">
          <input
            hidden
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setResult(null);
            }}
          />
          <div
            className="video-stage"
            onClick={() => inputRef.current?.click()}
          >
            <div className="video-grid" />
            {file ? (
              <>
                <span className="video-file">
                  <Video size={27} />
                  <b>{file.name}</b>
                  <small>Ready for frame analysis</small>
                </span>
              </>
            ) : (
              <>
                <span className="play-circle">
                  <Play size={24} fill="currentColor" />
                </span>
                <h3>Upload kitchen footage</h3>
                <p>MP4, MOV, or WebM · up to 5 minutes</p>
              </>
            )}
          </div>
          <button className="analyze-button" onClick={run} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Sampling key frames...
              </>
            ) : (
              <>
                <Video size={18} /> Analyze hygiene
              </>
            )}
          </button>
        </div>
        <div className="hygiene-results">
          {result ? (
            <>
              <div className="score-head">
                <div className="big-score">
                  {result.score}
                  <small>/100</small>
                </div>
                <div>
                  <span className="mini-label">HYGIENE SCORE</span>
                  <h3>{result.status} kitchen practice</h3>
                  <p>{result.duration} analyzed across 126 key frames</p>
                </div>
              </div>
              <div className="check-list">
                {result.checks.map((check) => (
                  <div key={check.label}>
                    <span
                      className={check.status === "Pass" ? "pass" : "review"}
                    >
                      {check.status === "Pass" ? <Check size={15} /> : "!"}
                    </span>
                    <span>
                      <strong>{check.label}</strong>
                      <small>{check.status}</small>
                    </span>
                    <b>{check.score}%</b>
                  </div>
                ))}
              </div>
              <div className="alert-box">
                <Clock3 size={17} />
                <p>
                  <strong>Moment to review · {result.alerts[0].time}</strong>
                  {result.alerts[0].message}
                </p>
              </div>
            </>
          ) : (
            <div className="empty-result compact">
              <div className="orb">
                <ShieldCheck size={25} />
              </div>
              <h3>Safety review ready when you are</h3>
              <p>
                We’ll surface clear checks and timestamped moments that need
                attention.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CookingAssistant() {
  const [prompt, setPrompt] = useState(
    "I have chickpeas, tomatoes, spinach, and 30 minutes",
  );
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const ask = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      setRecipe(await createRecipe(prompt));
    } catch {
      setRecipe({
        title: "Lemon herb chickpea skillet",
        subtitle: `A quick, balanced idea inspired by “${prompt}”`,
        time: "24 min",
        difficulty: "Easy",
        ingredients: [
          "Chickpeas",
          "Cherry tomatoes",
          "Spinach",
          "Lemon",
          "Garlic",
          "Herbs",
        ],
        steps: [
          "Warm olive oil and gently bloom the garlic.",
          "Add chickpeas and tomatoes; cook until the tomatoes soften.",
          "Fold in spinach, lemon zest, juice, and fresh herbs.",
          "Taste, season, and serve with toasted whole-grain bread.",
        ],
        tip: "Pat the chickpeas dry before cooking for better browning.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="tool-page cooking-page">
      <div className="cook-hero">
        <span className="mini-label">YOUR ADAPTIVE SOUS-CHEF</span>
        <h1>What are we cooking?</h1>
        <p>
          Tell me what you have, what you’re craving, or how much time you’ve
          got.
        </p>
        <div className="prompt-box">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            aria-label="Cooking request"
          />
          <div>
            <button className="voice-button" aria-label="Use voice">
              <Mic size={18} />
            </button>
            <button
              className="ask-button large"
              onClick={ask}
              disabled={loading}
            >
              {loading ? "Thinking…" : "Create my recipe"}{" "}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <div className="prompt-chips">
          <span
            onClick={() =>
              setPrompt("A high-protein vegetarian dinner in 20 minutes")
            }
          >
            High-protein dinner
          </span>
          <span
            onClick={() =>
              setPrompt("Use what is in my fridge and avoid dairy")
            }
          >
            Use what I have
          </span>
          <span
            onClick={() =>
              setPrompt("A healthy comfort meal for a rainy evening")
            }
          >
            Healthy comfort food
          </span>
        </div>
      </div>
      {recipe ? (
        <div className="recipe-card">
          <div className="recipe-intro">
            <div className="recipe-visual">
              <span>🍋</span>
              <i>🌿</i>
              <b>●</b>
            </div>
            <div>
              <span className="mini-label">RECIPE READY</span>
              <h2>{recipe.title}</h2>
              <p>{recipe.subtitle}</p>
              <div className="recipe-meta">
                <span>
                  <Clock3 size={15} />
                  {recipe.time}
                </span>
                <span>
                  <ChefHat size={15} />
                  {recipe.difficulty}
                </span>
                <span>
                  <Flame size={15} />
                  520 kcal
                </span>
              </div>
            </div>
          </div>
          <div className="recipe-columns">
            <div>
              <h3>What you’ll need</h3>
              <div className="ingredients">
                {recipe.ingredients.map((item) => (
                  <span key={item}>
                    <Plus size={13} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3>Let’s make it</h3>
              <ol>
                {recipe.steps.map((step, i) => (
                  <li key={step}>
                    <span>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="chef-tip">
            <Sparkles size={18} />
            <p>
              <strong>Chef’s tip</strong>
              {recipe.tip}
            </p>
          </div>
        </div>
      ) : (
        <div className="suggestion-grid">
          <Suggestion
            emoji="🥗"
            title="Bright & balanced"
            text="Mediterranean meals in under 30 min"
          />
          <Suggestion
            emoji="🍲"
            title="One-pot comfort"
            text="Less cleanup, all the flavor"
          />
          <Suggestion
            emoji="🌮"
            title="Make it together"
            text="Fun, flexible family dinners"
          />
        </div>
      )}
    </div>
  );
}

function Suggestion({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="suggestion">
      <span>{emoji}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <ArrowRight size={17} />
    </div>
  );
}

function MealPlanner() {
  const [goal, setGoal] = useState("balanced");
  const [diet, setDiet] = useState("everything");
  const [calories, setCalories] = useState(2000);
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const generate = async () => {
    setLoading(true);
    try {
      setPlan(await createMealPlan(goal, diet, calories));
    } catch {
      setPlan({
        goal,
        target_calories: calories,
        meals: [
          {
            time: "Breakfast",
            name: "Overnight oats with berries",
            calories: 410,
          },
          { time: "Lunch", name: "Herb chicken grain bowl", calories: 560 },
          { time: "Snack", name: "Apple, almonds & yogurt", calories: 260 },
          { time: "Dinner", name: "Miso salmon & greens", calories: 670 },
        ],
        coach_note:
          "Keep water nearby and aim for a palm-sized protein serving at lunch and dinner.",
      });
    } finally {
      setLoading(false);
    }
  };
  const total = useMemo(
    () => plan?.meals.reduce((sum, m) => sum + m.calories, 0) || 0,
    [plan],
  );
  return (
    <div className="tool-page">
      <div className="page-heading">
        <div>
          <span className="mini-label">PERSONAL NUTRITION</span>
          <h1>A meal plan that moves with you.</h1>
          <p>
            Set the direction. FoodVerse balances variety, nutrition, and the
            way you actually eat.
          </p>
        </div>
        <span className="model-pill">
          <CircleUserRound size={15} /> Profile synced
        </span>
      </div>
      <div className="planner-layout">
        <div className="planner-form">
          <h3>Shape your plan</h3>
          <label>
            Primary goal
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="balanced">Eat more balanced</option>
              <option value="weight-loss">Sustainable weight loss</option>
              <option value="muscle-gain">Build strength</option>
              <option value="heart-health">Heart health</option>
            </select>
          </label>
          <label>
            Eating style
            <select value={diet} onChange={(e) => setDiet(e.target.value)}>
              <option value="everything">Everything</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="pescatarian">Pescatarian</option>
            </select>
          </label>
          <label>
            Daily energy target
            <div className="range-value">
              <b>{calories.toLocaleString()}</b> kcal
            </div>
            <input
              type="range"
              min="1400"
              max="3200"
              step="100"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
            />
            <div className="range-labels">
              <span>1,400</span>
              <span>3,200</span>
            </div>
          </label>
          <button
            className="analyze-button"
            onClick={generate}
            disabled={loading}
          >
            {loading ? "Balancing your day…" : "Build my day"}
            <ArrowRight size={17} />
          </button>
        </div>
        <div className="plan-result">
          {plan ? (
            <>
              <div className="plan-head">
                <div>
                  <span className="mini-label">YOUR DAILY RHYTHM</span>
                  <h2>{total.toLocaleString()} kcal planned</h2>
                </div>
                <span className="match-badge">94% match</span>
              </div>
              <div className="meal-timeline">
                {plan.meals.map((meal, i) => (
                  <div key={meal.time}>
                    <span className="meal-num">0{i + 1}</span>
                    <i />
                    <div>
                      <small>{meal.time}</small>
                      <strong>{meal.name}</strong>
                    </div>
                    <b>{meal.calories} kcal</b>
                  </div>
                ))}
              </div>
              <div className="coach-note">
                <Sparkles size={19} />
                <p>
                  <strong>Your coach noticed</strong>
                  {plan.coach_note}
                </p>
              </div>
            </>
          ) : (
            <div className="empty-result">
              <div className="orb">
                <Apple size={25} />
              </div>
              <h3>Your day, thoughtfully arranged</h3>
              <p>
                Choose a goal and eating style. We’ll create a practical day you
                can adjust anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
