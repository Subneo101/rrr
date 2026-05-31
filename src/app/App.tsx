import { useState, useEffect } from 'react';
import { Zap, CheckCircle, XCircle, Settings, Timer, Trophy, Users } from 'lucide-react';

// Category word dictionary - valid answers for each category
const CATEGORY_WORDS: Record<string, string[]> = {
  "Fruits": ["APPLE", "BANANA", "CHERRY", "DATE", "ELDERBERRY", "FIG", "GRAPE", "HONEYDEW", "KIWI", "LEMON", "MANGO", "NECTARINE", "ORANGE", "PAPAYA", "QUINCE", "RASPBERRY", "STRAWBERRY", "TANGERINE", "UVA", "VANILLA", "WATERMELON", "XIMENIA", "YUZU", "ZUCCHINI", "APRICOT", "BLACKBERRY", "CANTALOUPE", "DRAGONFRUIT", "GUAVA", "LIME", "MELON", "PEACH", "PEAR", "PLUM", "PINEAPPLE", "POMEGRANATE", "JACKFRUIT", "COCONUT", "AVOCADO", "BLUEBERRY", "CRANBERRY", "GRAPEFRUIT", "KUMQUAT", "LYCHEE", "MANDARIN", "MULBERRY", "PASSION", "PERSIMMON", "RAMBUTAN", "STARFRUIT", "TOMATO", "BOYSENBERRY", "CLEMENTINE", "GOOSEBERRY", "LOGANBERRY", "OLIVE", "IMLI"],
  "Things in the Kitchen": ["BOWL", "DISH", "FORK", "GLASS", "KNIFE", "LADLE", "MUG", "OVEN", "PAN", "POT", "PLATE", "SPOON", "SINK", "STOVE", "TABLE", "TOASTER", "WHISK", "BLENDER", "CUTTING", "DRAWER", "FRIDGE", "GRATER", "MIXER", "NAPKIN", "REFRIGERATOR", "SPATULA", "TEAPOT", "TONGS", "TOWEL", "APRON", "BOARD", "CAN", "COLANDER", "CUP", "CUPBOARD", "DISHWASHER", "ESPRESSO", "FREEZER", "GRIDDLE", "KETTLE", "MICROWAVE", "OPENER", "PEELER", "PITCHER", "ROLLING", "SAUCER", "SCALE", "SCISSORS", "STRAINER", "THERMOMETER", "TIMER", "TRIVET", "UTENSIL", "WOK"],
  "Occupations": ["ACTOR", "BAKER", "CHEF", "DOCTOR", "ENGINEER", "FARMER", "GUARD", "HISTORIAN", "INTERPRETER", "JANITOR", "KEEPER", "LAWYER", "MUSICIAN", "NURSE", "OFFICER", "PILOT", "QUEEN", "REPORTER", "SCIENTIST", "TEACHER", "UMPIRE", "VET", "WRITER", "ZOOLOGIST", "ARCHITECT", "BARBER", "CARPENTER", "DENTIST", "ELECTRICIAN"],
  "Animals": ["ALLIGATOR", "BEAR", "CAT", "DOG", "ELEPHANT", "FOX", "GIRAFFE", "HORSE", "IGUANA", "JAGUAR", "KANGAROO", "LION", "MONKEY", "NEWT", "OSTRICH", "PANDA", "QUAIL", "RABBIT", "SNAKE", "TIGER", "UNICORN", "VULTURE", "WOLF", "YAK", "ZEBRA", "APE", "BIRD", "COW", "DEER", "EAGLE", "FISH", "GOAT", "HAMSTER", "ANTELOPE", "BADGER", "BUFFALO", "CAMEL", "CHEETAH", "CHICKEN", "CHIMPANZEE", "COYOTE", "CROCODILE", "DOLPHIN", "DONKEY", "DUCK", "FERRET", "FLAMINGO", "GORILLA", "HEDGEHOG", "HIPPOPOTAMUS", "KOALA", "LEOPARD", "LLAMA", "MOOSE", "OCTOPUS", "OWL", "PANTHER", "PARROT", "PEACOCK", "PENGUIN", "PIG", "POLAR", "PORCUPINE", "RACCOON", "RAT", "RAVEN", "RHINOCEROS", "SEAL", "SHARK", "SHEEP", "SKUNK", "SLOTH", "SPARROW", "SQUIRREL", "SWAN", "TORTOISE", "TURKEY", "TURTLE", "WALRUS", "WEASEL", "WHALE"],
  "Things that are Cold": ["ICE", "SNOW", "WINTER", "FREEZER", "GLACIER", "HAIL", "ICEBERG", "POPSICLE", "ANTARCTICA", "BLIZZARD", "FROST", "ICICLE", "SLEET", "TUNDRA", "ARCTIC", "COLD", "FROZEN", "REFRIGERATOR", "SORBET", "MILKSHAKE"],
  "Cities": ["ATLANTA", "BOSTON", "CHICAGO", "DALLAS", "EDINBURGH", "FRANKFURT", "GENEVA", "HOUSTON", "ISTANBUL", "JAKARTA", "KYOTO", "LONDON", "MIAMI", "NAIROBI", "ORLANDO", "PARIS", "QUEBEC", "ROME", "SYDNEY", "TOKYO", "UTAH", "VENICE", "WARSAW", "YORK", "ZURICH", "AMSTERDAM", "BARCELONA", "CAIRO", "DUBLIN", "FLORENCE"],
  "Colors": ["AMBER", "BLUE", "CRIMSON", "DENIM", "EMERALD", "FUCHSIA", "GREEN", "HAZEL", "INDIGO", "JADE", "KHAKI", "LIME", "MAGENTA", "NAVY", "OLIVE", "PINK", "QUARTZ", "RED", "SILVER", "TAN", "UMBER", "VIOLET", "WHITE", "YELLOW", "ZINC", "AQUA", "BEIGE", "CYAN", "GOLD", "GRAY", "ORANGE", "PURPLE", "ROSE"],
  "Sports": ["ARCHERY", "BASEBALL", "CRICKET", "DIVING", "EQUESTRIAN", "FOOTBALL", "GOLF", "HOCKEY", "ICE", "JUDO", "KARATE", "LACROSSE", "MARTIAL", "NASCAR", "OLYMPICS", "POLO", "QUIDDITCH", "RUGBY", "SOCCER", "TENNIS", "ULTIMATE", "VOLLEYBALL", "WRESTLING", "YOGA", "ZORBING", "BASKETBALL", "BOWLING", "BOXING", "FENCING", "RUNNING", "SKIING", "SWIMMING"],
  "Vehicles": ["AIRPLANE", "BOAT", "CAR", "DOGSLED", "ENGINE", "FERRY", "GONDOLA", "HELICOPTER", "JET", "KAYAK", "LIMOUSINE", "MOTORCYCLE", "OMNIBUS", "PLANE", "QUAD", "ROCKET", "SHIP", "TRAIN", "UBER", "VAN", "WAGON", "YACHT", "ZEPPELIN", "AMBULANCE", "BICYCLE", "BUS", "CANOE", "TRUCK", "SCOOTER", "SUBMARINE", "TAXI"],
  "Foods": ["APPLE", "BREAD", "CHEESE", "DONUT", "EGG", "FISH", "GARLIC", "HAM", "ICE", "JAM", "KALE", "LAMB", "MEAT", "NOODLE", "ONION", "PASTA", "QUICHE", "RICE", "SALAD", "TACO", "UDON", "VINEGAR", "WAFFLE", "YAM", "ZITI", "BACON", "BURGER", "CAKE", "CHIPS", "COOKIE", "PIZZA", "SOUP", "STEAK"],
  "Countries": ["ARGENTINA", "BRAZIL", "CANADA", "DENMARK", "EGYPT", "FRANCE", "GERMANY", "HUNGARY", "INDIA", "JAPAN", "KENYA", "LEBANON", "MEXICO", "NORWAY", "OMAN", "POLAND", "QATAR", "RUSSIA", "SPAIN", "TURKEY", "UGANDA", "VIETNAM", "WALES", "YEMEN", "ZIMBABWE", "AUSTRALIA", "BELGIUM", "CHINA", "ENGLAND", "ITALY", "KOREA", "PERU"],
  "Musical Instruments": ["ACCORDION", "BANJO", "CELLO", "DRUM", "EUPHONIUM", "FLUTE", "GUITAR", "HARP", "INSTRUMENT", "JEWS", "KAZOO", "LUTE", "MARIMBA", "OBOE", "PIANO", "QUENA", "RECORDER", "SAXOPHONE", "TROMBONE", "UKULELE", "VIOLIN", "WHISTLE", "XYLOPHONE", "ZITHER", "BAGPIPE", "CLARINET", "FIDDLE", "HORN", "ORGAN", "TRUMPET"],
  "Clothing Items": ["APRON", "BELT", "CAP", "DRESS", "EARMUFFS", "FEDORA", "GLOVES", "HAT", "JACKET", "JEANS", "KHAKIS", "LEGGINGS", "MITTENS", "NECKTIE", "OVERALLS", "PANTS", "QUILT", "ROBE", "SHIRT", "TIE", "UNIFORM", "VEST", "WINDBREAKER", "YARN", "ZIPPER", "BLOUSE", "COAT", "DENIM", "FROCK", "GOWN", "HOODIE", "KIMONO", "SCARF", "SHOES", "SKIRT", "SOCKS", "SWEATER"],
  "Things at School": ["ART", "BOOK", "CLASSROOM", "DESK", "ERASER", "FOLDER", "GYM", "HOMEWORK", "INK", "JOURNAL", "KINDERGARTEN", "LOCKER", "MARKER", "NOTEBOOK", "OFFICE", "PENCIL", "QUIZ", "RULER", "SCIENCE", "TEACHER", "UNIFORM", "VOCABULARY", "WHITEBOARD", "YEARBOOK", "ZONE", "ALGEBRA", "BACKPACK", "CAFETERIA", "DIAGRAM", "EXAM", "HALL", "LIBRARY", "PEN", "STAPLER"],
  "Types of Weather": ["BLIZZARD", "CLOUDY", "DRIZZLE", "ECLIPSE", "FOG", "GALE", "HAIL", "ICY", "JETSTREAM", "LIGHTNING", "MIST", "OVERCAST", "PRECIPITATION", "RAIN", "SLEET", "THUNDER", "UMBRELLA", "VORTEX", "WIND", "ZEPHYR", "COLD", "DRY", "FROST", "HEAT", "HUMID", "MONSOON", "SNOW", "STORM", "SUNNY", "TORNADO", "WARM", "WET"]
};

const CATEGORIES = Object.keys(CATEGORY_WORDS);

// Generate random letter for a player
function getRandomLetter(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

type Player = {
  id: number;
  name: string;
  letters: string[];
  answer: string;
  selectedLetter: string | null;
  score: number;
};

type FeedbackMessage = {
  playerId: number;
  message: string;
  type: 'success' | 'error';
};

type GameSettings = {
  mode: 'simple' | 'cumulative';
  votingEnabled: boolean;
  simpleTimer: number; // seconds
  cumulativeCategories: number;
  cumulativeRoundsPerCategory: number;
  cumulativeTimer: number; // seconds
};

type VoteRequest = {
  playerId: number;
  playerName: string;
  word: string;
  letter: string;
  votes: Record<number, boolean>; // playerId -> yes/no
};

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'simple',
    votingEnabled: true,
    simpleTimer: 30,
    cumulativeCategories: 3,
    cumulativeRoundsPerCategory: 3,
    cumulativeTimer: 15
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [categoriesQueue, setCategoriesQueue] = useState<string[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [roundActive, setRoundActive] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [voteRequest, setVoteRequest] = useState<VoteRequest | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  // Timer countdown
  useEffect(() => {
    if (roundActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (roundActive && timeLeft === 0) {
      handleRoundEnd();
    }
  }, [roundActive, timeLeft]);

  // Initialize players
  const initializePlayers = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      letters: Array.from({ length: 5 }, () => getRandomLetter()),
      answer: '',
      selectedLetter: null,
      score: 0
    }));
  };

  // Start game
  const startGame = () => {
    const newPlayers = initializePlayers(4);
    setPlayers(newPlayers);

    if (settings.mode === 'cumulative') {
      // Pick random categories
      const shuffled = shuffleArray(CATEGORIES);
      const selected = shuffled.slice(0, settings.cumulativeCategories);
      setCategoriesQueue(selected);
      setCurrentCategory(selected[0]);
      setCurrentCategoryIndex(0);
      setCurrentRound(1);
      setTimeLeft(settings.cumulativeTimer);
    } else {
      // Simple mode - pick one random category
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      setCurrentCategory(randomCategory);
      setTimeLeft(settings.simpleTimer);
    }

    setGameStarted(true);
    setRoundActive(true);
    setGameOver(false);
    setWinner(null);
  };

  // Handle round end
  const handleRoundEnd = () => {
    setRoundActive(false);

    if (settings.mode === 'cumulative') {
      // Check if this category is done
      if (currentRound < settings.cumulativeRoundsPerCategory) {
        // More rounds for this category
        setCurrentRound(currentRound + 1);
      } else if (currentCategoryIndex < categoriesQueue.length - 1) {
        // Move to next category
        setCurrentCategoryIndex(currentCategoryIndex + 1);
        setCurrentCategory(categoriesQueue[currentCategoryIndex + 1]);
        setCurrentRound(1);
      } else {
        // Game over - find winner by score
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        setWinner(sortedPlayers[0]);
        setGameOver(true);
        return;
      }
    }
  };

  // Continue to next round
  const continueToNextRound = () => {
    // Reset player answers and selected letters
    setPlayers(prev => prev.map(p => ({ ...p, answer: '', selectedLetter: null })));

    if (settings.mode === 'simple') {
      // Pick new random category
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      setCurrentCategory(randomCategory);
      setTimeLeft(settings.simpleTimer);
    } else {
      setTimeLeft(settings.cumulativeTimer);
    }

    setRoundActive(true);
  };

  // Handle answer input change
  const handleAnswerChange = (playerId: number, value: string) => {
    setPlayers(prev =>
      prev.map(p => p.id === playerId ? { ...p, answer: value } : p)
    );
  };

  // Handle letter tile click
  const handleLetterClick = (playerId: number, letter: string) => {
    setPlayers(prev =>
      prev.map(p => {
        if (p.id === playerId) {
          const newSelectedLetter = p.selectedLetter === letter ? null : letter;
          return { ...p, selectedLetter: newSelectedLetter };
        }
        return p;
      })
    );
  };

  // Submit and validate answer
  const handleSubmitAnswer = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.answer.trim()) return;

    const answer = player.answer.trim().toUpperCase();
    const firstLetter = answer[0];

    // Get valid words for current category
    const validWords = CATEGORY_WORDS[currentCategory] || [];

    // Check if letter was selected OR if answer starts with player's letter
    let letterIndex = -1;

    if (player.selectedLetter) {
      if (firstLetter !== player.selectedLetter) {
        setFeedback({
          playerId,
          message: `"${player.answer}" doesn't start with selected letter "${player.selectedLetter}"!`,
          type: 'error'
        });
        setTimeout(() => setFeedback(null), 3000);
        return;
      }
      letterIndex = player.letters.indexOf(player.selectedLetter);
    } else {
      letterIndex = player.letters.indexOf(firstLetter);
    }

    if (letterIndex === -1) {
      setFeedback({
        playerId,
        message: `"${player.answer}" doesn't start with any of your letters!`,
        type: 'error'
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    // Check if the word is in the valid word list for this category
    if (!validWords.includes(answer)) {
      // Word not found - allow challenge if voting is enabled
      if (settings.votingEnabled) {
        setFeedback({
          playerId,
          message: `"${player.answer}" is not in our dictionary. Request a vote?`,
          type: 'error'
        });
        setTimeout(() => setFeedback(null), 5000);
        return;
      } else {
        setFeedback({
          playerId,
          message: `"${player.answer}" is not a valid answer for "${currentCategory}"!`,
          type: 'error'
        });
        setTimeout(() => setFeedback(null), 3000);
        return;
      }
    }

    // Valid answer - discard the letter and award points
    acceptAnswer(playerId, letterIndex, firstLetter, player.answer);
  };

  // Accept answer (used for both direct validation and voting)
  const acceptAnswer = (playerId: number, letterIndex: number, letter: string, word: string) => {
    setPlayers(prev =>
      prev.map(p => {
        if (p.id === playerId) {
          const newLetters = [...p.letters];
          newLetters.splice(letterIndex, 1);
          const newScore = settings.mode === 'cumulative' ? p.score + 1 : p.score;

          // Check if player won (simple mode)
          if (settings.mode === 'simple' && newLetters.length === 0) {
            setWinner(p);
            setGameOver(true);
            setRoundActive(false);
          }

          return { ...p, letters: newLetters, answer: '', selectedLetter: null, score: newScore };
        }
        return p;
      })
    );

    setFeedback({
      playerId,
      message: `Great! "${word}" is correct. Letter "${letter}" discarded!`,
      type: 'success'
    });
    setTimeout(() => setFeedback(null), 3000);
    setVoteRequest(null);
  };

  // Request vote for challenged word
  const requestVote = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.answer.trim()) return;

    const answer = player.answer.trim().toUpperCase();
    const firstLetter = answer[0];
    const letter = player.selectedLetter || firstLetter;

    setVoteRequest({
      playerId,
      playerName: player.name,
      word: answer,
      letter: letter,
      votes: {}
    });
    setFeedback(null);
  };

  // Cast vote
  const castVote = (voterId: number, approve: boolean) => {
    if (!voteRequest) return;

    const newVotes = { ...voteRequest.votes, [voterId]: approve };
    setVoteRequest({ ...voteRequest, votes: newVotes });

    // Check if all other players have voted
    const otherPlayers = players.filter(p => p.id !== voteRequest.playerId);
    if (Object.keys(newVotes).length === otherPlayers.length) {
      // Tally votes
      const yesVotes = Object.values(newVotes).filter(v => v).length;
      const noVotes = Object.values(newVotes).filter(v => !v).length;

      if (yesVotes > noVotes) {
        // Majority approved - accept the answer and add to dictionary
        const player = players.find(p => p.id === voteRequest.playerId);
        if (player) {
          const letterIndex = player.letters.indexOf(voteRequest.letter);
          if (letterIndex !== -1) {
            // Add word to category dictionary
            CATEGORY_WORDS[currentCategory].push(voteRequest.word);
            acceptAnswer(voteRequest.playerId, letterIndex, voteRequest.letter, voteRequest.word);
          }
        }
      } else {
        // Rejected
        setFeedback({
          playerId: voteRequest.playerId,
          message: `Vote failed. "${voteRequest.word}" was not accepted.`,
          type: 'error'
        });
        setTimeout(() => setFeedback(null), 3000);
        setVoteRequest(null);
      }
    }
  };

  // Settings Panel
  if (showSettings && !gameStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 to-blue-600 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-purple-600">Game Settings</h2>
            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
              Close
            </button>
          </div>

          {/* Game Mode */}
          <div className="mb-6">
            <label className="block mb-2">Game Mode</label>
            <div className="flex gap-4">
              <button
                onClick={() => setSettings({ ...settings, mode: 'simple' })}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  settings.mode === 'simple'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="font-bold mb-1">Simple Mode</div>
                <div className="text-sm text-gray-600">Random category, first to discard all cards wins</div>
              </button>
              <button
                onClick={() => setSettings({ ...settings, mode: 'cumulative' })}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  settings.mode === 'cumulative'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="font-bold mb-1">Tournament Mode</div>
                <div className="text-sm text-gray-600">Multiple categories, highest score wins</div>
              </button>
            </div>
          </div>

          {/* Voting Toggle */}
          <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-bold">Player Voting</div>
              <div className="text-sm text-gray-600">Allow players to vote on challenged words</div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, votingEnabled: !settings.votingEnabled })}
              className={`w-14 h-8 rounded-full transition-colors ${
                settings.votingEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`size-6 bg-white rounded-full transition-transform ${
                settings.votingEnabled ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Simple Mode Settings */}
          {settings.mode === 'simple' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-blue-900 mb-3">Simple Mode Settings</h3>
              <div>
                <label className="block mb-2 text-sm">Round Timer (seconds)</label>
                <input
                  type="number"
                  value={settings.simpleTimer}
                  onChange={(e) => setSettings({ ...settings, simpleTimer: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  min="10"
                  max="300"
                />
              </div>
            </div>
          )}

          {/* Cumulative Mode Settings */}
          {settings.mode === 'cumulative' && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-purple-900 mb-3">Tournament Mode Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Number of Categories</label>
                  <input
                    type="number"
                    value={settings.cumulativeCategories}
                    onChange={(e) => setSettings({ ...settings, cumulativeCategories: parseInt(e.target.value) || 3 })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Rounds per Category</label>
                  <input
                    type="number"
                    value={settings.cumulativeRoundsPerCategory}
                    onChange={(e) => setSettings({ ...settings, cumulativeRoundsPerCategory: parseInt(e.target.value) || 3 })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Timer per Round (seconds)</label>
                  <input
                    type="number"
                    value={settings.cumulativeTimer}
                    onChange={(e) => setSettings({ ...settings, cumulativeTimer: parseInt(e.target.value) || 15 })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                    min="5"
                    max="120"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowSettings(false)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  }

  // Welcome Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="size-12 text-yellow-500" />
            <h1 className="text-purple-600">Rapid Rumble</h1>
          </div>
          <p className="text-gray-600 mb-8">Be the first to discard all your letters!</p>

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              Start Game
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="w-full bg-white hover:bg-gray-50 text-purple-600 font-bold py-4 px-6 rounded-lg border-2 border-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Settings className="size-5" />
              Settings
            </button>
          </div>

          <div className="mt-8 text-left bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-700 mb-2">
              <strong>Mode:</strong> {settings.mode === 'simple' ? 'Simple' : 'Tournament'}
            </div>
            <div className="text-sm text-gray-700 mb-2">
              <strong>Voting:</strong> {settings.votingEnabled ? 'Enabled' : 'Disabled'}
            </div>
            {settings.mode === 'cumulative' && (
              <div className="text-sm text-gray-700">
                <strong>Format:</strong> {settings.cumulativeCategories} categories × {settings.cumulativeRoundsPerCategory} rounds × {settings.cumulativeTimer}s
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameOver && winner) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <Trophy className="size-20 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-purple-600 mb-2">Game Over!</h1>
          <h2 className="text-gray-800 mb-6">{winner.name} Wins!</h2>

          {settings.mode === 'cumulative' && (
            <div className="mb-6 bg-purple-50 p-4 rounded-lg">
              <h3 className="text-purple-900 mb-3">Final Scores</h3>
              <div className="space-y-2">
                {[...players].sort((a, b) => b.score - a.score).map((player, idx) => (
                  <div key={player.id} className="flex justify-between items-center">
                    <span className="font-bold">{idx + 1}. {player.name}</span>
                    <span className="text-purple-600 font-bold">{player.score} points</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setGameStarted(false);
              setGameOver(false);
              setWinner(null);
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            New Game
          </button>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="size-8 text-yellow-300" />
            <h1 className="text-white">Rapid Rumble</h1>
          </div>
          {settings.mode === 'cumulative' && (
            <p className="text-white/80">
              Category {currentCategoryIndex + 1}/{categoriesQueue.length} • Round {currentRound}/{settings.cumulativeRoundsPerCategory}
            </p>
          )}
        </div>

        {/* Timer and Category */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 mb-1">Current Category</p>
              <h2 className="text-purple-600">{currentCategory}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft <= 5 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <Timer className="size-5" />
                <span className="font-bold text-xl">{timeLeft}s</span>
              </div>
              {!roundActive && (
                <button
                  onClick={continueToNextRound}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {settings.mode === 'simple' ? 'Next Category' : 'Next Round'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scoreboard (Cumulative mode only) */}
        {settings.mode === 'cumulative' && (
          <div className="bg-white rounded-xl shadow-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="size-5 text-yellow-600" />
              <h3 className="text-gray-800">Scoreboard</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {players.map((player) => (
                <div key={player.id} className="text-center">
                  <div className="text-sm text-gray-600">{player.name}</div>
                  <div className="text-2xl font-bold text-purple-600">{player.score}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vote Request Banner */}
        {voteRequest && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="size-5 text-yellow-800" />
              <h3 className="text-yellow-900">Vote Request</h3>
            </div>
            <p className="text-yellow-900 mb-3">
              <strong>{voteRequest.playerName}</strong> wants to use "<strong>{voteRequest.word}</strong>" for {currentCategory}. Vote to approve:
            </p>
            <div className="grid grid-cols-4 gap-4">
              {players.filter(p => p.id !== voteRequest.playerId).map((player) => {
                const hasVoted = voteRequest.votes[player.id] !== undefined;
                const vote = voteRequest.votes[player.id];
                return (
                  <div key={player.id} className="text-center">
                    <div className="text-sm text-gray-700 mb-2">{player.name}</div>
                    {hasVoted ? (
                      <div className={`px-3 py-1 rounded-lg ${vote ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {vote ? '✓ Yes' : '✗ No'}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => castVote(player.id, true)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => castVote(player.id, false)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Players Grid */}
        <div className="grid grid-cols-2 gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-800">{player.name}</h3>
                {settings.mode === 'cumulative' && (
                  <div className="text-purple-600 font-bold">{player.score} pts</div>
                )}
              </div>

              {/* Letter Cards */}
              <div className="flex gap-2 flex-wrap mb-4">
                {player.letters.length > 0 ? (
                  player.letters.map((letter, idx) => (
                    <button
                      key={idx}
                      onClick={() => roundActive && handleLetterClick(player.id, letter)}
                      disabled={!roundActive}
                      className={`size-16 bg-gradient-to-br rounded-lg shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                        player.selectedLetter === letter
                          ? 'from-green-400 to-green-600 ring-4 ring-green-300'
                          : 'from-yellow-400 to-orange-500'
                      } ${!roundActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-white text-3xl font-bold">{letter}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-green-600 font-bold">All cards discarded!</p>
                )}
              </div>

              {/* Answer Input */}
              {player.letters.length > 0 && roundActive && (
                <div className="space-y-3">
                  {player.selectedLetter && (
                    <div className="text-sm text-gray-600 bg-green-50 p-2 rounded-lg border border-green-200">
                      Selected letter: <span className="font-bold text-green-700">{player.selectedLetter}</span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={player.answer}
                    onChange={(e) => handleAnswerChange(player.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitAnswer(player.id);
                      }
                    }}
                    placeholder={player.selectedLetter ? `Word starting with ${player.selectedLetter}...` : "Type answer or click letter..."}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmitAnswer(player.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Submit
                    </button>
                    {settings.votingEnabled && feedback && feedback.playerId === player.id && feedback.type === 'error' && feedback.message.includes('not in our dictionary') && (
                      <button
                        onClick={() => requestVote(player.id)}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Request Vote
                      </button>
                    )}
                  </div>

                  {/* Feedback */}
                  {feedback && feedback.playerId === player.id && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {feedback.type === 'success' ? (
                        <CheckCircle className="size-5" />
                      ) : (
                        <XCircle className="size-5" />
                      )}
                      <span className="text-sm font-medium">{feedback.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
