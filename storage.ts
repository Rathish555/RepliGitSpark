import {
  users,
  scenarios,
  userProgress,
  aiInsights,
  learningPaths,
  type User,
  type InsertUser,
  type Scenario,
  type InsertScenario,
  type UserProgress,
  type InsertUserProgress,
  type AiInsight,
  type InsertAiInsight,
  type LearningPath,
  type InsertLearningPath,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Scenario methods
  getScenarios(): Promise<Scenario[]>;
  getScenario(id: number): Promise<Scenario | undefined>;
  getScenariosByFramework(framework: string): Promise<Scenario[]>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;

  // User Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressForScenario(userId: number, scenarioId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // AI Insights methods
  getAiInsights(userId: number): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;

  // Learning Path methods
  getLearningPaths(): Promise<LearningPath[]>;
  getLearningPath(id: number): Promise<LearningPath | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private scenarios: Map<number, Scenario> = new Map();
  private userProgress: Map<number, UserProgress> = new Map();
  private aiInsights: Map<number, AiInsight> = new Map();
  private learningPaths: Map<number, LearningPath> = new Map();
  
  private currentUserId = 1;
  private currentScenarioId = 1;
  private currentProgressId = 1;
  private currentInsightId = 1;
  private currentPathId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "sarah.chen",
      password: "password123",
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@example.com",
      currentStreak: 7,
      completedScenarios: 24,
      successRate: 87,
      aiInsights: 12,
      timeInvested: 1080, // 18 hours
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Create sample scenarios with different difficulty levels
    const sampleScenarios: Scenario[] = [
      {
        id: 1,
        title: "Daily Standup Facilitation",
        description: "Learn to facilitate an effective daily standup meeting with proper time management and team engagement.",
        framework: "scrum",
        difficulty: "beginner",
        duration: 10,
        rating: 45,
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Opening the Standup",
              situation: "You're facilitating your first daily standup as a new Scrum Master. The team consists of 5 developers who are used to informal check-ins. You need to establish structure while keeping the meeting engaging.",
              characters: [
                {
                  name: "Alex Johnson",
                  role: "Senior Developer",
                  personality: "Experienced team member who prefers efficient meetings. Values getting straight to the point.",
                  avatar: "AJ"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Start with the standard format: Yesterday, Today, Blockers",
                  description: "Use the traditional three questions to structure the standup meeting.",
                  points: 25,
                  feedback: "Perfect! The standard format helps new teams establish routine and ensures all important topics are covered."
                },
                {
                  id: 2,
                  text: "Ask each person to share whatever they think is important",
                  description: "Take a more flexible approach and let team members choose what to share.",
                  points: 15,
                  feedback: "While flexibility is good, structure helps ensure consistency and that nothing important is missed."
                },
                {
                  id: 3,
                  text: "Focus only on blockers and impediments",
                  description: "Skip individual updates and concentrate on problems that need resolution.",
                  points: 18,
                  feedback: "Good focus on problem-solving, but daily updates help maintain team awareness and sprint momentum."
                },
                {
                  id: 4,
                  text: "Let the team lead the meeting themselves",
                  description: "Step back and allow the team to self-organize the standup format.",
                  points: 10,
                  feedback: "Self-organization is valuable, but as a new team, they need initial guidance to establish effective patterns."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Meeting Facilitation", "Team Communication", "Scrum Events"]
      },
      {
        id: 2,
        title: "Stakeholder Conflict Resolution",
        description: "Navigate a heated disagreement between product owner and development team about feature priorities during sprint planning.",
        framework: "scrum",
        difficulty: "intermediate",
        duration: 15,
        rating: 48, // 4.8 stars
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Initial Conflict",
              situation: "The Product Owner, Maria Santos, insists on adding three new high-priority features to the upcoming sprint. However, the Development Team lead, David Kim, argues that the team is already at capacity and taking on more work will compromise quality and potentially cause sprint failure.",
              characters: [
                {
                  name: "Maria Santos",
                  role: "Product Owner",
                  personality: "Pressure from executives for quick market response. Highly analytical, data-driven decision maker.",
                  avatar: "MS"
                },
                {
                  name: "David Kim",
                  role: "Development Team Lead", 
                  personality: "Focused on sustainable pace and quality. Values team autonomy and technical excellence.",
                  avatar: "DK"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Facilitate a discussion to find compromise",
                  description: "Guide both parties to understand each other's constraints and find middle ground through collaborative problem-solving.",
                  points: 25,
                  feedback: "Excellent approach! Facilitating dialogue demonstrates servant leadership and helps build understanding between stakeholders."
                },
                {
                  id: 2,
                  text: "Support the Development Team's position",
                  description: "Protect the team from overcommitment and maintain focus on sustainable delivery practices.",
                  points: 20,
                  feedback: "Good instinct to protect the team, but consider exploring the Product Owner's constraints before taking sides."
                },
                {
                  id: 3,
                  text: "Suggest a time-boxed experiment",
                  description: "Propose trying one additional feature with clear success criteria and fallback plans.",
                  points: 22,
                  feedback: "Creative solution! Time-boxing reduces risk while allowing for experimentation."
                },
                {
                  id: 4,
                  text: "Escalate to senior management",
                  description: "Involve higher-level stakeholders to make the final decision on priorities and resource allocation.",
                  points: 10,
                  feedback: "Escalation should be a last resort. As Scrum Master, you should first try to facilitate resolution at the team level."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Conflict Resolution", "Stakeholder Management", "Sprint Planning"]
      },
      {
        id: 3,
        title: "Sprint Planning Crisis",
        description: "Team velocity drops 40% mid-sprint due to unexpected technical debt. Navigate stakeholder expectations while maintaining quality.",
        framework: "scrum",
        difficulty: "advanced",
        duration: 18,
        rating: 48,
        imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        content: {
          steps: [
            {
              id: 1,
              title: "Velocity Crisis",
              situation: "Three days into the sprint, the team discovers significant technical debt that requires immediate attention, dropping their velocity by 40%. The Product Owner is concerned about missing the sprint goal, while the team insists they need to address the technical issues.",
              characters: [
                {
                  name: "Jennifer Walsh",
                  role: "Product Owner",
                  personality: "Results-driven with pressure from executives to deliver features on schedule. Struggles to understand technical complexity.",
                  avatar: "JW"
                },
                {
                  name: "Michael Chen",
                  role: "Tech Lead",
                  personality: "Quality-focused engineer who's concerned about accumulating technical debt. Advocates for sustainable development practices.",
                  avatar: "MC"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Negotiate scope reduction with stakeholders",
                  description: "Work with the Product Owner to identify lower-priority items that can be moved to the next sprint.",
                  points: 25,
                  feedback: "Excellent approach! Scope negotiation maintains sprint integrity while addressing technical concerns. This is core to Agile adaptability."
                },
                {
                  id: 2,
                  text: "Push the team to work overtime to meet commitments",
                  description: "Encourage the team to put in extra hours to complete both technical debt and planned features.",
                  points: 8,
                  feedback: "This creates unsustainable pace and burnout. Agile values sustainable development and team well-being over short-term feature delivery."
                },
                {
                  id: 3,
                  text: "Split the sprint - some work on debt, others on features",
                  description: "Divide the team to work on both priorities simultaneously.",
                  points: 15,
                  feedback: "While pragmatic, this can reduce collaboration and knowledge sharing. Consider the impact on team cohesion and code quality."
                },
                {
                  id: 4,
                  text: "Ignore technical debt and focus on sprint goal",
                  description: "Advise the team to postpone technical improvements to meet feature commitments.",
                  points: 5,
                  feedback: "This creates future problems and goes against sustainable development practices. Technical debt compounds and will eventually slow all development."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Crisis Management", "Technical Debt", "Stakeholder Communication"]
      },
      {
        id: 4,
        title: "Basic Kanban Board Setup",
        description: "Set up your first Kanban board and establish work-in-progress limits for optimal flow.",
        framework: "kanban",
        difficulty: "beginner",
        duration: 12,
        rating: 44,
        imageUrl: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        content: {
          steps: [
            {
              id: 1,
              title: "Designing Board Columns",
              situation: "Your team is transitioning from ad-hoc work management to Kanban. You need to design a board that reflects your actual workflow and helps identify bottlenecks.",
              characters: [],
              decisions: [
                {
                  id: 1,
                  text: "Use To Do, Doing, Done columns",
                  description: "Start with the simplest three-column setup to get the team comfortable with visual workflow.",
                  points: 20,
                  feedback: "Good starting point! Simple boards help teams adapt quickly, though you may need more columns as processes become clearer."
                },
                {
                  id: 2,
                  text: "Map columns to actual workflow steps",
                  description: "Create columns that match your team's real process: Backlog, Analysis, Development, Testing, Deployment, Done.",
                  points: 25,
                  feedback: "Excellent! Mapping to actual workflow reveals bottlenecks and makes work visible. This is core to Kanban effectiveness."
                },
                {
                  id: 3,
                  text: "Copy another team's successful board layout",
                  description: "Use a proven board design from a similar team to avoid reinventing the process.",
                  points: 12,
                  feedback: "While efficiency is good, each team's workflow is unique. What works for others may not fit your context and constraints."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Visual Management", "Workflow Design", "Kanban Fundamentals"]
      },
      {
        id: 5,
        title: "Executive Pressure Crisis",
        description: "C-level executive demands immediate feature delivery that conflicts with current workflow optimization efforts.",
        framework: "kanban",
        difficulty: "expert",
        duration: 25,
        rating: 49,
        imageUrl: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        content: {
          steps: [
            {
              id: 1,
              title: "Executive Override",
              situation: "The CEO has just called an emergency meeting. A major client is threatening to leave unless a specific feature is delivered within 2 weeks. Your team is in the middle of important workflow improvements that will increase long-term efficiency, but this urgent request would derail those efforts and overload your current capacity.",
              characters: [
                {
                  name: "Robert Harrison",
                  role: "CEO",
                  personality: "Business-focused executive under pressure from board and major clients. Values immediate results over process improvements.",
                  avatar: "RH"
                },
                {
                  name: "Lisa Rodriguez",
                  role: "Development Manager",
                  personality: "Process-oriented leader who understands the long-term value of workflow optimization. Concerned about team burnout and technical debt.",
                  avatar: "LR"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Present data-driven impact analysis of the request",
                  description: "Quantify the cost of context switching, show workflow metrics, and present alternative solutions with timelines.",
                  points: 25,
                  feedback: "Outstanding! Using data to influence executive decisions demonstrates Kanban's emphasis on metrics and continuous improvement. This builds trust through transparency."
                },
                {
                  id: 2,
                  text: "Immediately stop all current work to focus on the urgent feature",
                  description: "Drop everything and reallocate the full team to meet the executive's deadline.",
                  points: 10,
                  feedback: "This reactive approach ignores flow principles and creates chaos. Constant priority switching reduces overall efficiency and team morale."
                },
                {
                  id: 3,
                  text: "Negotiate a compromise that protects core workflow improvements",
                  description: "Propose delivering a minimum viable version of the feature while maintaining key process improvements.",
                  points: 22,
                  feedback: "Good negotiation approach! Finding middle ground protects long-term improvements while addressing business needs. Consider the sustainability of this compromise."
                },
                {
                  id: 4,
                  text: "Escalate to explain why the request cannot be accommodated",
                  description: "Stand firm on protecting the team's capacity and workflow optimization timeline.",
                  points: 15,
                  feedback: "While protecting the team is important, this approach may damage stakeholder relationships. Consider how to influence rather than resist."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Executive Management", "Data-Driven Decisions", "Workflow Protection", "Crisis Management"]
      },
      {
        id: 6,
        title: "Program Increment Planning",
        description: "Facilitate your first PI Planning event with multiple teams and stakeholders in a SAFe environment.",
        framework: "safe",
        difficulty: "intermediate",
        duration: 20,
        rating: 46,
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        content: {
          steps: [
            {
              id: 1,
              title: "Coordinating Multiple Teams",
              situation: "You're facilitating PI Planning for 3 Agile teams. Each team has different priorities and there are several cross-team dependencies that need to be identified and resolved during the planning session.",
              characters: [
                {
                  name: "Sarah Kim",
                  role: "Product Manager Team Alpha",
                  personality: "Focused on delivering customer-facing features. Sometimes overlooks technical dependencies in favor of business priorities.",
                  avatar: "SK"
                },
                {
                  name: "David Martinez",
                  role: "Scrum Master Team Beta",
                  personality: "Process-focused and detail-oriented. Wants to ensure all risks and dependencies are properly identified and documented.",
                  avatar: "DM"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Use dependency mapping workshop to visualize connections",
                  description: "Facilitate a structured activity where teams identify and map all dependencies visually.",
                  points: 24,
                  feedback: "Excellent SAFe practice! Visual dependency mapping helps teams understand interconnections and plan accordingly. This prevents surprises during execution."
                },
                {
                  id: 2,
                  text: "Handle dependencies through informal team discussions",
                  description: "Let teams work out dependencies through ad-hoc conversations during planning breaks.",
                  points: 15,
                  feedback: "While informal coordination can work, structured dependency management in SAFe ensures nothing is missed and provides transparency."
                },
                {
                  id: 3,
                  text: "Assign a dependency coordinator role",
                  description: "Designate one person to track and manage all cross-team dependencies.",
                  points: 18,
                  feedback: "This can work short-term, but SAFe emphasizes shared responsibility and transparency. Consider how to involve all teams in dependency management."
                }
              ]
            }
          ]
        },
        learningObjectives: ["PI Planning", "Dependency Management", "Cross-team Coordination"]
      },
      {
        id: 7,
        title: "Enterprise Transformation Crisis", 
        description: "Multiple teams blocked by shared component delivery delays. Navigate competing priorities across 3 Agile Release Trains during a critical enterprise transformation.",
        framework: "safe",
        difficulty: "expert",
        duration: 30,
        rating: 50,
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        content: {
          steps: [
            {
              id: 1,
              title: "Multi-ART Dependency Crisis",
              situation: "You're the Release Train Engineer overseeing a critical enterprise transformation. Three Agile Release Trains are blocked waiting for a shared platform component that's 3 weeks behind schedule. The delay is causing a cascade of issues across 12 teams, affecting a $10M customer commitment, and executive leadership is demanding immediate resolution.",
              characters: [
                {
                  name: "Amanda Foster",
                  role: "VP of Engineering",
                  personality: "Strategic leader under intense board pressure. Needs clear communication about risks and mitigation strategies. Values data-driven decisions.",
                  avatar: "AF"
                },
                {
                  name: "Carlos Rivera",
                  role: "Solution Architect",
                  personality: "Technical expert who understands the platform complexity. Concerned about technical debt if rushed. Prefers thorough solutions over quick fixes.",
                  avatar: "CR"
                },
                {
                  name: "Rachel Thompson",
                  role: "Business Owner",
                  personality: "Customer-focused with deep market knowledge. Under pressure from major clients who are threatening to switch to competitors.",
                  avatar: "RT"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Implement emergency cross-ART swarming strategy",
                  description: "Coordinate resources across all three ARTs to focus on the blocked component, temporarily reducing other work.",
                  points: 25,
                  feedback: "Excellent crisis management! Cross-ART swarming leverages SAFe's coordinated approach to resolve critical bottlenecks. This demonstrates systems thinking."
                },
                {
                  id: 2,
                  text: "Negotiate alternative technical approaches with each ART",
                  description: "Work with solution architects to identify temporary workarounds or alternative implementations for each blocked team.",
                  points: 22,
                  feedback: "Strong problem-solving approach! Exploring alternatives shows adaptive leadership, though ensure solutions don't create future technical debt."
                },
                {
                  id: 3,
                  text: "Restructure the program timeline and reset expectations",
                  description: "Formally adjust all program increment commitments and communicate revised timelines to all stakeholders.",
                  points: 18,
                  feedback: "Transparency is valuable, but consider if there are ways to mitigate the delay before accepting a full timeline reset."
                },
                {
                  id: 4,
                  text: "Escalate to executive leadership for additional resources",
                  description: "Request emergency budget approval to hire contractors or reassign staff from other programs.",
                  points: 15,
                  feedback: "Sometimes necessary, but external resources take time to onboard and may not solve immediate problems. Consider other options first."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Program Management", "Crisis Leadership", "Cross-ART Coordination", "Enterprise Scaling"]
      },
      
      // DSDM Scenarios
      {
        id: 8,
        title: "DSDM MoSCoW Prioritization",
        description: "Learn to apply MoSCoW prioritization technique effectively in your first DSDM project to manage requirements and stakeholder expectations.",
        framework: "dsdm",
        difficulty: "beginner",
        duration: 12,
        rating: 43,
        imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Requirements Prioritization Workshop",
              situation: "You're facilitating your first MoSCoW prioritization session with stakeholders who all believe their requirements are critical. The project has 25 requirements but only capacity for 15 in the initial delivery.",
              characters: [
                {
                  name: "Helen Wright",
                  role: "Business Sponsor",
                  personality: "Budget-conscious executive focused on ROI. Wants to ensure core business value is delivered first.",
                  avatar: "HW"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Guide stakeholders through DSDM's MoSCoW definitions systematically",
                  description: "Explain Must have, Should have, Could have, Won't have categories with clear business value criteria.",
                  points: 25,
                  feedback: "Perfect! DSDM's strength lies in clear prioritization criteria. This ensures everyone understands the framework before applying it."
                },
                {
                  id: 2,
                  text: "Let stakeholders self-categorize their requirements first",
                  description: "Allow each stakeholder to place their requirements in MoSCoW categories without guidance.",
                  points: 12,
                  feedback: "This often leads to everything being 'Must have'. DSDM requires facilitated prioritization to be effective."
                },
                {
                  id: 3,
                  text: "Use voting to determine requirement priorities",
                  description: "Have stakeholders vote on which requirements are most important using dot voting.",
                  points: 15,
                  feedback: "While democratic, this doesn't align with DSDM's business value-focused approach to prioritization."
                }
              ]
            }
          ]
        },
        learningObjectives: ["MoSCoW Prioritization", "Requirements Management", "Stakeholder Facilitation"]
      },
      {
        id: 9,
        title: "DSDM Timeboxing Crisis",
        description: "Navigate a critical situation where your DSDM timebox is at risk due to scope creep and stakeholder pressure to include additional features.",
        framework: "dsdm",
        difficulty: "intermediate",
        duration: 16,
        rating: 47,
        imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Scope Creep Challenge",
              situation: "Mid-way through your 4-week timebox, stakeholders want to add 3 new 'critical' features. The development team warns this will break the timebox deadline, but business stakeholders insist all features are essential.",
              characters: [
                {
                  name: "Mark Stevens",
                  role: "Business Analyst",
                  personality: "Detail-oriented professional who struggles with the trade-offs required in timeboxing. Wants to accommodate all stakeholder requests.",
                  avatar: "MS"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Strictly enforce timebox boundaries and defer new requirements",
                  description: "Explain DSDM principles and move new features to the next iteration or release.",
                  points: 25,
                  feedback: "Excellent! DSDM's fixed timebox principle prevents scope creep and maintains predictable delivery. This protects project control."
                },
                {
                  id: 2,
                  text: "Extend the timebox to accommodate critical features",
                  description: "Negotiate a longer timebox to include the additional requirements.",
                  points: 10,
                  feedback: "This violates core DSDM principles. Timeboxes must remain fixed to maintain project discipline and predictability."
                },
                {
                  id: 3,
                  text: "Re-prioritize existing features using MoSCoW to make room",
                  description: "Facilitate a re-prioritization session to potentially swap lower-priority items for the new requests.",
                  points: 22,
                  feedback: "Good application of DSDM flexibility! Re-prioritization within fixed timeboxes maintains project control while adapting to business needs."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Timeboxing", "Scope Management", "DSDM Principles"]
      },

      // FDD Scenarios  
      {
        id: 10,
        title: "Feature-Driven Development Modeling",
        description: "Create your first object model and develop an initial feature list for a new e-commerce platform using FDD methodology.",
        framework: "fdd",
        difficulty: "beginner", 
        duration: 14,
        rating: 44,
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Building the Object Model",
              situation: "You're leading the domain modeling session for a new e-commerce platform. The team includes domain experts, developers, and business analysts who need to create a shared understanding of the business domain.",
              characters: [
                {
                  name: "Dr. Patricia Kim",
                  role: "Domain Expert",
                  personality: "Experienced e-commerce professional with deep business knowledge. Values thorough analysis before development begins.",
                  avatar: "PK"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Facilitate collaborative domain modeling sessions with all stakeholders",
                  description: "Use FDD's modeling approach with domain experts, developers, and business analysts working together.",
                  points: 25,
                  feedback: "Perfect FDD approach! Collaborative modeling ensures shared understanding and reduces miscommunication later in development."
                },
                {
                  id: 2,
                  text: "Have developers create the technical model independently",
                  description: "Let the development team design the object model based on technical requirements.",
                  points: 12,
                  feedback: "This misses FDD's emphasis on domain-driven modeling. Business knowledge is essential for creating meaningful models."
                },
                {
                  id: 3,
                  text: "Use existing industry standard models as a starting point",
                  description: "Adopt proven e-commerce models from other successful platforms.",
                  points: 18,
                  feedback: "While efficient, FDD emphasizes domain-specific modeling. Generic models may not capture your unique business requirements."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Domain Modeling", "Feature Identification", "Collaborative Design"]
      },
      {
        id: 11,
        title: "FDD Feature Team Scaling Challenge",
        description: "Manage multiple feature teams working on interdependent features while maintaining FDD's class ownership principle and avoiding integration conflicts.",
        framework: "fdd",
        difficulty: "advanced",
        duration: 20,
        rating: 48,
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Class Ownership Conflicts",
              situation: "Three feature teams need to modify the same core classes for their features. Team A needs payment processing changes, Team B requires user authentication updates, and Team C wants inventory management modifications. All are working simultaneously and conflicts are emerging.",
              characters: [
                {
                  name: "Thomas Anderson",
                  role: "Chief Programmer",
                  personality: "Technical leader responsible for maintaining code quality and architectural integrity. Concerned about conflicting changes and technical debt.",
                  avatar: "TA"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Implement FDD's class ownership model with designated owners",
                  description: "Assign each core class to a specific developer who coordinates all changes and maintains integrity.",
                  points: 25,
                  feedback: "Excellent FDD practice! Class ownership prevents conflicts and ensures code quality while enabling parallel development."
                },
                {
                  id: 2,
                  text: "Create separate branches for each team to work independently",
                  description: "Use version control branching to isolate team changes until integration time.",
                  points: 15,
                  feedback: "While this reduces immediate conflicts, it goes against FDD's continuous integration principles and can create larger merge problems."
                },
                {
                  id: 3,
                  text: "Sequence the teams to avoid simultaneous changes",
                  description: "Have teams work on features sequentially rather than in parallel to avoid conflicts.",
                  points: 12,
                  feedback: "This reduces FDD's parallel development benefits. Proper class ownership allows safe concurrent development."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Class Ownership", "Team Coordination", "Parallel Development"]
      },

      // Lean Scenarios
      {
        id: 12,
        title: "Lean Value Stream Mapping",
        description: "Create your first value stream map to identify waste and optimize flow in a software development process.",
        framework: "lean",
        difficulty: "beginner",
        duration: 16,
        rating: 45,
        imageUrl: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Mapping Current State",
              situation: "Your organization wants to improve software delivery speed. You're leading a value stream mapping exercise to understand the current development process from requirement to production deployment.",
              characters: [
                {
                  name: "Janet Foster",
                  role: "Process Improvement Manager",
                  personality: "Data-driven manager focused on efficiency metrics. Wants concrete evidence of improvement opportunities.",
                  avatar: "JF"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Walk the actual process with all stakeholders involved",
                  description: "Physically follow work through each step, timing activities and identifying handoffs and delays.",
                  points: 25,
                  feedback: "Perfect Lean approach! Gemba walks reveal the reality of work flow and uncover hidden waste that process documents miss."
                },
                {
                  id: 2,
                  text: "Review existing process documentation and procedures",
                  description: "Use official process documents and workflow diagrams to map the value stream.",
                  points: 15,
                  feedback: "Documentation often differs from reality. Lean emphasizes observing actual work to find true improvement opportunities."
                },
                {
                  id: 3,
                  text: "Survey team members about their daily activities",
                  description: "Collect information through questionnaires and interviews about how work flows through the system.",
                  points: 18,
                  feedback: "Surveys provide insights but may miss unconscious waste and delays. Direct observation reveals more accurate improvement opportunities."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Value Stream Mapping", "Waste Identification", "Process Analysis"]
      },
      {
        id: 13,
        title: "Lean Manufacturing Crisis in Software",
        description: "Apply Lean principles to resolve a critical production quality issue that's causing customer defects and threatening major client relationships.",
        framework: "lean",
        difficulty: "expert",
        duration: 22,
        rating: 49,
        imageUrl: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Quality Crisis Response",
              situation: "Your software has a critical defect affecting 15% of users. Customer complaints are escalating, support tickets are overwhelming the team, and two major clients are threatening to cancel contracts. The root cause is unclear and pressure is mounting for immediate fixes.",
              characters: [
                {
                  name: "Dr. Maria Santos",
                  role: "Quality Assurance Director",
                  personality: "Systematic problem-solver with Lean Six Sigma background. Believes in root cause analysis over quick fixes.",
                  avatar: "MS"
                },
                {
                  name: "Kevin Park",
                  role: "Customer Success Manager",
                  personality: "Customer-focused professional under pressure from angry clients. Wants immediate visible action to preserve relationships.",
                  avatar: "KP"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Implement immediate containment while conducting root cause analysis",
                  description: "Use Lean problem-solving: contain the issue, analyze root causes with 5 Whys, then implement permanent solutions.",
                  points: 25,
                  feedback: "Outstanding Lean crisis management! Containment protects customers while root cause analysis prevents recurrence. This balances immediate and long-term needs."
                },
                {
                  id: 2,
                  text: "Roll back to previous version immediately",
                  description: "Quickly revert to the last known good version to stop customer impact.",
                  points: 18,
                  feedback: "Good immediate response, but without root cause analysis, the problem may recur. Lean emphasizes understanding why problems occur."
                },
                {
                  id: 3,
                  text: "Deploy multiple small fixes rapidly to address symptoms",
                  description: "Quickly patch visible issues as they're reported to show responsiveness to customers.",
                  points: 12,
                  feedback: "This reactive approach can introduce new issues and doesn't address root causes. Lean focuses on systematic problem-solving."
                },
                {
                  id: 4,
                  text: "Form a war room to coordinate intensive debugging efforts",
                  description: "Gather all technical experts to work around the clock until the issue is resolved.",
                  points: 15,
                  feedback: "While showing urgency, this can lead to rushed decisions and burnout. Lean emphasizes structured problem-solving over heroic efforts."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Crisis Management", "Root Cause Analysis", "Quality Systems", "Lean Problem-Solving"]
      },

      // XP Scenarios
      {
        id: 14,
        title: "XP Pair Programming Introduction",
        description: "Introduce pair programming to a team resistant to the practice and demonstrate its benefits for code quality and knowledge sharing.",
        framework: "xp",
        difficulty: "beginner",
        duration: 10,
        rating: 42,
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "Overcoming Pair Programming Resistance",
              situation: "Your development team is skeptical about pair programming. Several senior developers believe it's inefficient and slows them down. You need to introduce the practice while addressing their concerns about productivity.",
              characters: [
                {
                  name: "Ryan Mitchell",
                  role: "Senior Developer",
                  personality: "Highly productive individual contributor who values autonomy. Skeptical of practices that seem to reduce individual efficiency.",
                  avatar: "RM"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Start with knowledge-sharing sessions and rotate pairs regularly",
                  description: "Implement XP pairing practices gradually, emphasizing learning and code quality benefits.",
                  points: 25,
                  feedback: "Perfect XP approach! Starting gradually with clear benefits builds buy-in. Regular rotation spreads knowledge and prevents pairing fatigue."
                },
                {
                  id: 2,
                  text: "Make pair programming mandatory for all development work",
                  description: "Require all code to be written in pairs according to XP principles.",
                  points: 12,
                  feedback: "While consistent with XP, forcing the practice without buy-in often creates resistance. Gradual adoption works better."
                },
                {
                  id: 3,
                  text: "Use pair programming only for complex or critical code",
                  description: "Apply pairing selectively to high-risk areas where the benefits are most obvious.",
                  points: 20,
                  feedback: "This demonstrates value but misses XP's emphasis on continuous pairing for knowledge sharing and code quality across all work."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Pair Programming", "Team Adoption", "XP Practices"]
      },
      {
        id: 15,
        title: "XP Test-Driven Development Crisis",
        description: "Navigate a situation where TDD practices are breaking down under delivery pressure, causing quality issues and technical debt accumulation.",
        framework: "xp",
        difficulty: "intermediate",
        duration: 18,
        rating: 47,
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        content: {
          steps: [
            {
              id: 1,
              title: "TDD Discipline Under Pressure",
              situation: "Your team has been practicing TDD successfully, but a tight deadline is causing developers to skip writing tests first. Code quality is declining, bugs are increasing, and stakeholders are pressuring for faster delivery without understanding the long-term consequences.",
              characters: [
                {
                  name: "Lisa Wong",
                  role: "Project Manager",
                  personality: "Results-oriented manager focused on meeting deadlines. Struggles to understand how 'extra' testing activities contribute to delivery speed.",
                  avatar: "LW"
                }
              ],
              decisions: [
                {
                  id: 1,
                  text: "Reinforce TDD discipline and demonstrate quality impact to stakeholders",
                  description: "Show metrics on bug rates, rework time, and long-term velocity to justify maintaining TDD practices.",
                  points: 25,
                  feedback: "Excellent XP leadership! Data-driven advocacy for TDD shows how short-term discipline creates long-term speed and quality."
                },
                {
                  id: 2,
                  text: "Temporarily reduce testing requirements to meet the deadline",
                  description: "Allow the team to skip TDD temporarily to deliver faster, planning to add tests later.",
                  points: 8,
                  feedback: "This violates core XP principles and creates technical debt. 'Later' rarely comes, and quality continues to decline."
                },
                {
                  id: 3,
                  text: "Negotiate scope reduction to maintain TDD practices",
                  description: "Work with stakeholders to reduce features rather than compromise development practices.",
                  points: 22,
                  feedback: "Good protection of XP values! Scope negotiation maintains long-term code health while adapting to business constraints."
                }
              ]
            }
          ]
        },
        learningObjectives: ["Test-Driven Development", "Quality Advocacy", "Stakeholder Education"]
      }
    ];

    sampleScenarios.forEach(scenario => {
      this.scenarios.set(scenario.id, scenario);
    });
    this.currentScenarioId = 16;

    // Create sample learning paths
    const samplePaths: LearningPath[] = [
      {
        id: 1,
        name: "Scrum Fundamentals",
        description: "Master core Scrum practices from basic ceremonies to advanced conflict resolution",
        framework: "scrum",
        scenarios: [1, 2, 3],
        order: 1
      },
      {
        id: 2,
        name: "Kanban Mastery",
        description: "Learn to optimize workflow and handle executive pressure using Kanban principles",
        framework: "kanban",
        scenarios: [4, 5],
        order: 2
      },
      {
        id: 3,
        name: "SAFe Implementation",
        description: "Navigate complex enterprise scenarios with multiple teams and dependencies",
        framework: "safe",
        scenarios: [6, 7],
        order: 3
      },
      {
        id: 4,
        name: "DSDM Project Management",
        description: "Master MoSCoW prioritization and timeboxing in dynamic business environments",
        framework: "dsdm",
        scenarios: [8, 9],
        order: 4
      },
      {
        id: 5,
        name: "Feature-Driven Development",
        description: "Learn domain modeling and feature team coordination in large-scale development",
        framework: "fdd",
        scenarios: [10, 11],
        order: 5
      },
      {
        id: 6,
        name: "Lean Software Development",
        description: "Apply Lean principles to eliminate waste and improve quality in software processes",
        framework: "lean",
        scenarios: [12, 13],
        order: 6
      },
      {
        id: 7,
        name: "Extreme Programming Practices",
        description: "Implement XP practices like pair programming and TDD under real-world pressures",
        framework: "xp",
        scenarios: [14, 15],
        order: 7
      },
      {
        id: 8,
        name: "PMI-ACP Certification Prep",
        description: "Comprehensive multi-framework scenarios covering all PMI-ACP domains and knowledge areas",
        framework: "certification",
        scenarios: [1, 4, 6, 8, 10, 12, 14],
        order: 8
      }
    ];

    samplePaths.forEach(path => {
      this.learningPaths.set(path.id, path);
    });
    this.currentPathId = 9;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      currentStreak: 0,
      completedScenarios: 0,
      successRate: 0,
      aiInsights: 0,
      timeInvested: 0,
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Scenario methods
  async getScenarios(): Promise<Scenario[]> {
    return Array.from(this.scenarios.values());
  }

  async getScenario(id: number): Promise<Scenario | undefined> {
    return this.scenarios.get(id);
  }

  async getScenariosByFramework(framework: string): Promise<Scenario[]> {
    return Array.from(this.scenarios.values()).filter(s => s.framework === framework);
  }

  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const scenario: Scenario = {
      ...insertScenario,
      id: this.currentScenarioId++,
      rating: 0,
      imageUrl: insertScenario.imageUrl || null,
      learningObjectives: insertScenario.learningObjectives || null,
    };
    this.scenarios.set(scenario.id, scenario);
    return scenario;
  }

  // User Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async getUserProgressForScenario(userId: number, scenarioId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(p => p.userId === userId && p.scenarioId === scenarioId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const progress: UserProgress = {
      ...insertProgress,
      id: this.currentProgressId++,
      currentStep: insertProgress.currentStep || 0,
      decisions: insertProgress.decisions || [],
      completed: insertProgress.completed || false,
      score: insertProgress.score || null,
      timeSpent: insertProgress.timeSpent || 0,
      startedAt: new Date(),
      completedAt: null,
    };
    this.userProgress.set(progress.id, progress);
    return progress;
  }

  async updateUserProgress(id: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    if (updates.completed && !progress.completed) {
      updatedProgress.completedAt = new Date();
    }
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // AI Insights methods
  async getAiInsights(userId: number): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values())
      .filter(insight => insight.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createAiInsight(insertInsight: InsertAiInsight): Promise<AiInsight> {
    const insight: AiInsight = {
      ...insertInsight,
      id: this.currentInsightId++,
      scenarioId: insertInsight.scenarioId || null,
      createdAt: new Date(),
    };
    this.aiInsights.set(insight.id, insight);
    return insight;
  }

  // Learning Path methods
  async getLearningPaths(): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values()).sort((a, b) => a.order - b.order);
  }

  async getLearningPath(id: number): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }
}

export const storage = new MemStorage();
