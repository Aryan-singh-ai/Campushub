// Mock API client – returns mock data for the frontend demo

const STUDENT_INFO_SECTION = {
  id: "sec-student",
  title: "Student Information",
  fields: [
    {
      id: "f-name",
      label: "Full Name",
      type: "text",
      isRequired: true,
      placeholder: "e.g. Karthik Rajan",
    },
    {
      id: "f-enrollment",
      label: "Enrollment Number",
      type: "text",
      isRequired: true,
      placeholder: "e.g. EN2022CS0421",
    },
    {
      id: "f-email",
      label: "University Email ID",
      type: "email",
      isRequired: true,
      placeholder: "e.g. karthik@university.edu",
    },
    {
      id: "f-phone",
      label: "Contact Number",
      type: "text",
      isRequired: true,
      placeholder: "e.g. +91-98765-43210",
    },
  ],
};

const MOCK_EVENTS = [
  {
    id: "evt-001",
    title: "CSE Tech Fest 2025",
    description:
      "A grand technology festival featuring hackathons, paper presentations, and workshops. Open to all branches.",
    category: { name: "Technical" },
    venue: "Main Auditorium, Block A",
    date: "2025-07-28T09:00:00.000Z",
    isPaid: true,
    regFee: 299,
    paymentInstructions:
      "Scan the UPI QR code and transfer ₹299. Enter the UTR reference number below.",
    registrationForm: {
      sections: [
        STUDENT_INFO_SECTION,
        {
          id: "sec-academic",
          title: "Academic Details",
          fields: [
            {
              id: "f-branch",
              label: "Branch / Department",
              type: "text",
              isRequired: true,
              placeholder: "e.g. Computer Science & Engineering",
            },
            {
              id: "f-year",
              label: "Year of Study",
              type: "radio",
              isRequired: true,
              options: [
                { id: "yr-1", label: "1st Year", value: "1" },
                { id: "yr-2", label: "2nd Year", value: "2" },
                { id: "yr-3", label: "3rd Year", value: "3" },
                { id: "yr-4", label: "4th Year", value: "4" },
              ],
            },
          ],
        },
        {
          id: "sec-event",
          title: "Event Track Selection",
          fields: [
            {
              id: "f-track",
              label: "Which track are you participating in?",
              type: "radio",
              isRequired: true,
              options: [
                { id: "tr-1", label: "Hackathon (Team of 2–4)", value: "hackathon" },
                { id: "tr-2", label: "Paper Presentation (Solo / Duo)", value: "paper" },
                { id: "tr-3", label: "Workshop Attendee", value: "workshop" },
              ],
            },
            {
              id: "f-team",
              label: "Team Name (for Hackathon participants)",
              type: "text",
              isRequired: false,
              placeholder: "e.g. ByteStormers",
            },
            {
              id: "f-idea",
              label: "Brief Project / Paper Idea",
              type: "paragraph",
              isRequired: false,
              placeholder: "Describe your idea in 2–3 lines...",
            },
            {
              id: "f-diet",
              label: "Dietary Preference",
              type: "radio",
              isRequired: true,
              options: [
                { id: "d-1", label: "Vegetarian", value: "veg" },
                { id: "d-2", label: "Non-Vegetarian", value: "nonveg" },
                { id: "d-3", label: "Vegan", value: "vegan" },
              ],
            },
            {
              id: "f-tshirt",
              label: "T-Shirt Size",
              type: "radio",
              isRequired: true,
              options: [
                { id: "ts-1", label: "S", value: "S" },
                { id: "ts-2", label: "M", value: "M" },
                { id: "ts-3", label: "L", value: "L" },
                { id: "ts-4", label: "XL", value: "XL" },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "evt-002",
    title: "Annual Photography Showcase",
    description:
      "Submit your best shots and compete in the campus photography competition. All genres welcome.",
    category: { name: "Cultural" },
    venue: "Gallery Hall, Block C",
    date: "2025-08-15T10:00:00.000Z",
    isPaid: false,
    regFee: 0,
    registrationForm: {
      sections: [
        STUDENT_INFO_SECTION,
        {
          id: "sec-academic",
          title: "Academic Details",
          fields: [
            {
              id: "f-branch",
              label: "Branch / Department",
              type: "text",
              isRequired: true,
              placeholder: "e.g. Electronics & Communication",
            },
            {
              id: "f-year",
              label: "Year of Study",
              type: "radio",
              isRequired: true,
              options: [
                { id: "yr-1", label: "1st Year", value: "1" },
                { id: "yr-2", label: "2nd Year", value: "2" },
                { id: "yr-3", label: "3rd Year", value: "3" },
                { id: "yr-4", label: "4th Year", value: "4" },
              ],
            },
          ],
        },
        {
          id: "sec-photo",
          title: "Photography Entry Details",
          fields: [
            {
              id: "f-theme",
              label: "Theme Category",
              type: "radio",
              isRequired: true,
              options: [
                { id: "th-1", label: "Nature & Wildlife", value: "nature" },
                { id: "th-2", label: "Urban & Architecture", value: "urban" },
                { id: "th-3", label: "Portrait & People", value: "portrait" },
                { id: "th-4", label: "Abstract & Macro", value: "abstract" },
              ],
            },
            {
              id: "f-camera",
              label: "Equipment Used",
              type: "radio",
              isRequired: true,
              options: [
                { id: "cam-1", label: "DSLR / Mirrorless", value: "dslr" },
                { id: "cam-2", label: "Smartphone", value: "phone" },
                { id: "cam-3", label: "Film Camera", value: "film" },
              ],
            },
            {
              id: "f-entries",
              label: "Number of Photos to Submit",
              type: "radio",
              isRequired: true,
              options: [
                { id: "e-1", label: "1 Photo", value: "1" },
                { id: "e-2", label: "2 Photos", value: "2" },
                { id: "e-3", label: "3 Photos (Max)", value: "3" },
              ],
            },
            {
              id: "f-desc",
              label: "Artist Statement",
              type: "paragraph",
              isRequired: false,
              placeholder:
                "Tell us about your photographic style and what inspired your entry...",
            },
          ],
        },
      ],
    },
  },
  {
    id: "evt-003",
    title: "Inter-College Quiz Bowl",
    description:
      "Battle of minds across general knowledge, science, current affairs, and pop culture. Team event — register as a pair.",
    category: { name: "Academic" },
    venue: "Seminar Hall 2, Block B",
    date: "2025-09-05T11:00:00.000Z",
    isPaid: true,
    regFee: 100,
    paymentInstructions:
      "Transfer ₹100 per team via UPI and submit the UTR number below.",
    registrationForm: {
      sections: [
        {
          id: "sec-p1",
          title: "Team Member 1 (Primary)",
          fields: [
            {
              id: "f-p1-name",
              label: "Full Name",
              type: "text",
              isRequired: true,
              placeholder: "e.g. Divya Menon",
            },
            {
              id: "f-p1-enroll",
              label: "Enrollment Number",
              type: "text",
              isRequired: true,
              placeholder: "e.g. EN2022CS0101",
            },
            {
              id: "f-p1-email",
              label: "Email ID",
              type: "email",
              isRequired: true,
              placeholder: "e.g. divya@university.edu",
            },
            {
              id: "f-p1-branch",
              label: "Branch & Year",
              type: "text",
              isRequired: true,
              placeholder: "e.g. CSE – 3rd Year",
            },
          ],
        },
        {
          id: "sec-p2",
          title: "Team Member 2",
          fields: [
            {
              id: "f-p2-name",
              label: "Full Name",
              type: "text",
              isRequired: true,
              placeholder: "e.g. Rahul Verma",
            },
            {
              id: "f-p2-enroll",
              label: "Enrollment Number",
              type: "text",
              isRequired: true,
              placeholder: "e.g. EN2022ME0204",
            },
            {
              id: "f-p2-email",
              label: "Email ID",
              type: "email",
              isRequired: true,
              placeholder: "e.g. rahul@university.edu",
            },
            {
              id: "f-p2-branch",
              label: "Branch & Year",
              type: "text",
              isRequired: true,
              placeholder: "e.g. Mechanical – 2nd Year",
            },
          ],
        },
        {
          id: "sec-quiz",
          title: "Quiz Preferences",
          fields: [
            {
              id: "f-teamname",
              label: "Team Name",
              type: "text",
              isRequired: true,
              placeholder: "e.g. The Brainiacs",
            },
            {
              id: "f-strength",
              label: "Your strongest quiz category",
              type: "radio",
              isRequired: true,
              options: [
                { id: "q-1", label: "Science & Technology", value: "sci" },
                { id: "q-2", label: "History & Geography", value: "hist" },
                { id: "q-3", label: "Sports & Entertainment", value: "sports" },
                { id: "q-4", label: "Current Affairs", value: "current" },
              ],
            },
            {
              id: "f-participated",
              label: "Have you participated in a quiz event before?",
              type: "radio",
              isRequired: true,
              options: [
                { id: "qp-1", label: "Yes – at inter-college level", value: "intercollege" },
                { id: "qp-2", label: "Yes – at intra-college level", value: "intracollege" },
                { id: "qp-3", label: "No – first time", value: "first" },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "evt-004",
    title: "Sports Meet 2025",
    description:
      "Annual sports meet featuring cricket, basketball, badminton, and athletics. Register for your chosen sport.",
    category: { name: "Sports" },
    venue: "University Sports Ground",
    date: "2025-09-20T08:00:00.000Z",
    isPaid: false,
    regFee: 0,
    registrationForm: {
      sections: [
        STUDENT_INFO_SECTION,
        {
          id: "sec-academic",
          title: "Academic Details",
          fields: [
            {
              id: "f-branch",
              label: "Branch / Department",
              type: "text",
              isRequired: true,
              placeholder: "e.g. Mechanical Engineering",
            },
            {
              id: "f-year",
              label: "Year of Study",
              type: "radio",
              isRequired: true,
              options: [
                { id: "yr-1", label: "1st Year", value: "1" },
                { id: "yr-2", label: "2nd Year", value: "2" },
                { id: "yr-3", label: "3rd Year", value: "3" },
                { id: "yr-4", label: "4th Year", value: "4" },
              ],
            },
          ],
        },
        {
          id: "sec-sport",
          title: "Sports Selection",
          fields: [
            {
              id: "f-sport",
              label: "Choose your sport",
              type: "radio",
              isRequired: true,
              options: [
                { id: "sp-1", label: "Cricket", value: "cricket" },
                { id: "sp-2", label: "Basketball", value: "basketball" },
                { id: "sp-3", label: "Badminton (Singles)", value: "badminton_singles" },
                { id: "sp-4", label: "Badminton (Doubles)", value: "badminton_doubles" },
                { id: "sp-5", label: "100m Sprint", value: "sprint_100" },
                { id: "sp-6", label: "Long Jump", value: "longjump" },
              ],
            },
            {
              id: "f-exp",
              label: "Experience Level",
              type: "radio",
              isRequired: true,
              options: [
                { id: "exp-1", label: "Beginner", value: "beginner" },
                { id: "exp-2", label: "Intermediate", value: "intermediate" },
                { id: "exp-3", label: "Advanced / Represented college before", value: "advanced" },
              ],
            },
            {
              id: "f-partner",
              label: "Doubles partner name (if Badminton Doubles)",
              type: "text",
              isRequired: false,
              placeholder: "e.g. Sneha Iyer",
            },
            {
              id: "f-medical",
              label: "Any medical conditions we should be aware of?",
              type: "paragraph",
              isRequired: false,
              placeholder: "Leave blank if none...",
            },
          ],
        },
      ],
    },
  },
];

const MOCK_PROPOSALS = [
  {
    id: "prop-001",
    title: "Robotics Workshop Series",
    status: "PENDING",
    club: "Coding Club",
    submittedAt: "2025-06-25T10:00:00.000Z",
  },
  {
    id: "prop-002",
    title: "Art Exhibition – Monsoon Edition",
    status: "APPROVED",
    club: "Fine Arts Club",
    submittedAt: "2025-06-20T14:00:00.000Z",
  },
  {
    id: "prop-003",
    title: "Inter-College Quiz Bowl",
    status: "PENDING",
    club: "Quiz Club",
    submittedAt: "2025-06-22T09:00:00.000Z",
  },
];

export async function apiFetch(path: string, options?: RequestInit): Promise<any> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!options?.method || options.method === "GET") {
    if (path.match(/^\/events\/([^/]+)$/)) {
      const id = path.split("/")[2];
      let eventsList = [...MOCK_EVENTS];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("campushub_published_events");
        if (stored) {
          try {
            eventsList = [...eventsList, ...JSON.parse(stored)];
          } catch {}
        }
      }
      const rawEvent = eventsList.find((e) => e.id === id) ?? eventsList[0];
      const event = JSON.parse(JSON.stringify(rawEvent));
      
      // Clean CGPA and inject College ID / Payment uploads
      if (event.registrationForm && event.registrationForm.sections) {
        event.registrationForm.sections.forEach((sec: any) => {
          sec.fields = sec.fields.filter((f: any) => f.id !== "f-cgpa");
        });
        const hasUploads = event.registrationForm.sections.some((sec: any) => sec.id === "sec-documents");
        if (!hasUploads) {
          event.registrationForm.sections.push({
            id: "sec-documents",
            title: "Required Uploads",
            fields: [
              {
                id: "f-college-id",
                label: "College ID Card Image",
                type: "file",
                isRequired: true,
                description: "Upload a clear photo or PDF scan of your student ID card.",
              },
              {
                id: "f-payment-screenshot",
                label: "Screenshot of Payment",
                type: "file",
                isRequired: event.isPaid,
                description: "Upload payment transaction screenshot/receipt.",
              }
            ]
          });
        }
      }
      return { success: true, event };
    }
    if (path === "/events") {
      let eventsList = [...MOCK_EVENTS];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("campushub_published_events");
        if (stored) {
          try {
            eventsList = [...eventsList, ...JSON.parse(stored)];
          } catch {}
        }
      }
      
      const transformedList = eventsList.map((rawEvent) => {
        const event = JSON.parse(JSON.stringify(rawEvent));
        if (event.registrationForm && event.registrationForm.sections) {
          event.registrationForm.sections.forEach((sec: any) => {
            sec.fields = sec.fields.filter((f: any) => f.id !== "f-cgpa");
          });
          const hasUploads = event.registrationForm.sections.some((sec: any) => sec.id === "sec-documents");
          if (!hasUploads) {
            event.registrationForm.sections.push({
              id: "sec-documents",
              title: "Required Uploads",
              fields: [
                {
                  id: "f-college-id",
                  label: "College ID Card Image",
                  type: "file",
                  isRequired: true,
                  description: "Upload a clear photo or PDF scan of your student ID card.",
                },
                {
                  id: "f-payment-screenshot",
                  label: "Screenshot of Payment",
                  type: "file",
                  isRequired: event.isPaid,
                  description: "Upload payment transaction screenshot/receipt.",
                }
              ]
            });
          }
        }
        return event;
      });
      return { success: true, events: transformedList };
    }
    if (path === "/proposals") {
      return { success: true, proposals: MOCK_PROPOSALS };
    }
  }

  if (options?.method === "POST" && path === "/registrations") {
    return {
      success: true,
      registration: {
        id: `reg-${Math.random().toString(36).substring(7)}`,
        status: "PENDING",
      },
    };
  }

  if (options?.method === "POST" && path.includes("/payment")) {
    return { success: true };
  }

  return { success: true };
}
