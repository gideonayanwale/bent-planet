export interface ConferenceContentVariant {
  fullDescription: string;
  agenda: { time: string; title: string; description: string }[];
  speakerBio: string;
  socialCaptions: {
    instagram: string;
    whatsapp: string;
    twitter: string;
    facebook: string;
    youtube?: string;
  };
  ogTitle: string;
  ogDescription: string;
}

export const PREBUILT_VARIANTS: Record<
  string,
  (name: string, churchName: string, speaker: string, date: string) => ConferenceContentVariant
> = {
  revival_healing: (name, churchName, speaker, date) => ({
    fullDescription: `Welcome to ${name}, a transformative spiritual gathering hosted by ${churchName}. We are standing on the cusp of an unprecedented move of the Holy Spirit. This conference is dedicated to believers who yearn for authentic spiritual revival, personal breakthrough, and the miraculous healing touch of God.\n\nUnder the ministry of ${speaker}, expect dynamic atmospheres of intercession, deep worship, and life-changing biblical truth. Come with expectant faith to witness the restoration of health, peace of mind, and renewed spiritual fire in your walk with Jesus Christ.`,
    agenda: [
      { time: "09:00 AM", title: "Opening Worship & Consecration", description: "Laying the altar, deep adoration, and atmospheric worship." },
      { time: "10:30 AM", title: "Keynote Ministration: The Fire of Revival", description: `Anointing for spiritual awakening with ${speaker}.` },
      { time: "01:00 PM", title: "Prophetic Prayer & Altar Call", description: "Targeted intercession for personal breakthrough and territorial revival." },
      { time: "03:30 PM", title: "Healing & Deliverance Impartation", description: "Laying on of hands and equipping believers for kingdom impact." },
    ],
    speakerBio: `${speaker} is a dedicated minister of the Gospel with a recognized calling to proclaim revival, faith, and the supernatural power of God. With years of ministry experience, ${speaker} carries an apostolic passion to see believers restored and ignited for kingdom purpose.`,
    socialCaptions: {
      instagram: `🔥 REVIVAL & HEALING IS HERE! Join us for ${name} hosted by ${churchName}.\n\nGod is moving in power, and we are believing for signs, wonders, and breakthroughs with minister ${speaker}.\n\n📅 Date: ${date}\n📍 Online Stream\n\n👉 Click the link in bio to register free! #Revival #Healing #${name.replace(/[^a-zA-Z0-9]/g, "")} #${churchName.replace(/[^a-zA-Z0-9]/g, "")}`,
      whatsapp: `🙌 *${name.toUpperCase()}* 🙌\n\n${churchName} invites you to an unmissable revival & healing conference with *${speaker}*!\n\nExpect worship, miracles, and the fire of God 🔥\n\n🗓 Date: ${date}\n💻 Online Stream\n\nRegister free here: `,
      twitter: `Ready for a fresh move of God? ${name} is coming up on ${date} with ${speaker}! Experience atmospheric revival and healing. Register now:`,
      facebook: `We invite you, your family, and friends to join ${churchName} for ${name}! We are believing God for salvation, physical healing, and spiritual renewal. Speaker: ${speaker}. Register free today!`,
      youtube: `Join ${churchName} for ${name} featuring minister ${speaker}. Live stream starting ${date}. Make sure to subscribe and click the bell for notifications!`,
    },
    ogTitle: `${name} — Revival & Healing Gathering`,
    ogDescription: `Join ${churchName} and minister ${speaker} on ${date} for an outpouring of the Holy Spirit.`,
  }),

  prophetic_prayer: (name, churchName, speaker, date) => ({
    fullDescription: `${name} is a high-level prophetic summit convened by ${churchName} to release divine clarity, spiritual direction, and kingdom instructions for this season. When the people of God gather in united prayer, heaven responds with clarity.\n\nLed by ${speaker}, this conference provides a consecrated atmosphere where mysteries are unveiled, spiritual vision is sharpened, and the power of prevailing intercession shifts atmospheres and breaks long-standing barriers.`,
    agenda: [
      { time: "10:00 AM", title: "Atmospheric Worship & High Praise", description: "Setting the spiritual climate through prophetic song and declaration." },
      { time: "11:30 AM", title: "Unveiling Heaven's Blueprint", description: `Deep prophetic teaching and divine insight with ${speaker}.` },
      { time: "02:00 PM", title: "Targeted Intercession & Prophetic Presbytery", description: "Personal and territorial prophetic ministry and breakthrough prayer." },
    ],
    speakerBio: `${speaker} is an insightful prophetic teacher known for spiritual accuracy, biblical depth, and a passion for mentoring intercessors and ministry leaders.`,
    socialCaptions: {
      instagram: `🔮 Prophetic Clarity & Divine Direction! Join ${churchName} for ${name} with ${speaker}.\n\n📅 ${date} | Online Gathering\n\nLink in bio to register! #${name.replace(/[^a-zA-Z0-9]/g, "")} #Prophetic #Prayer`,
      whatsapp: `✨ *PROPHETIC & PRAYER SUMMIT: ${name}* ✨\n\nReceive clarity and spiritual direction for your next season with ${speaker} & ${churchName}.\n\nDate: ${date}\nLink to join: `,
      twitter: `Receive prophetic clarity and spiritual direction at ${name} with ${speaker} on ${date}. Save your spot now!`,
      facebook: `God has a word for your season! ${churchName} invites you to ${name} with ${speaker} on ${date}. Register for free today.`,
    },
    ogTitle: `${name} — Prophetic & Prayer Summit`,
    ogDescription: `Unveiling divine direction with ${speaker} and ${churchName}.`,
  }),

  leadership_ministry: (name, churchName, speaker, date) => ({
    fullDescription: `Equip yourself for generational leadership at ${name}, hosted by ${churchName}. Great leadership is forged in the presence of God and refined through practical kingdom wisdom. This conference gathers church leaders, marketplace influencers, and ministry workers who are ready to elevate their capacity, sharpen their vision, and build with excellence.\n\nFeaturing keynote sessions by ${speaker}, you will gain actionable frameworks on team culture, spiritual endurance, stewardship, and effective kingdom advancement.`,
    agenda: [
      { time: "09:00 AM", title: "Opening Keynote: Leading with Integrity & Vision", description: `Foundational leadership principles with ${speaker}.` },
      { time: "11:00 AM", title: "Operational Excellence & Ministry Strategy", description: "Building systems that scale while preserving spiritual culture." },
      { time: "01:30 PM", title: "Leadership Panel & Executive Q&A", description: "Interactive session addressing modern ministry and workplace challenges." },
      { time: "03:00 PM", title: "Commissioning & Impartation", description: "Prayer for wisdom, grace, and sustained organizational impact." },
    ],
    speakerBio: `${speaker} is an executive leader, author, and seasoned pastor committed to raising high-impact leaders for both the church and the marketplace.`,
    socialCaptions: {
      instagram: `📈 Elevate Your Leadership Capacity! Join ${churchName} for ${name} with ${speaker}.\n\nLearn practical strategy and spiritual wisdom for modern ministry.\n\n📅 ${date} | Register free in bio! #Leadership #Ministry`,
      whatsapp: `👔 *LEADERSHIP SUMMIT: ${name}* 👔\n\n${churchName} invites all leaders, pastors, and marketplace ministers to ${name} with *${speaker}*.\n\n🗓 ${date}\nRegister: `,
      twitter: `Sharpen your leadership skills and kingdom vision at ${name} on ${date} with ${speaker}. Register free today:`,
      facebook: `Calling all leaders, ministers, and visionaries! ${churchName} presents ${name} with ${speaker} on ${date}. Don't miss this catalytic summit.`,
    },
    ogTitle: `${name} — Leadership & Ministry Summit`,
    ogDescription: `Practical leadership and spiritual wisdom with ${speaker} and ${churchName}.`,
  }),

  youth_campus: (name, churchName, speaker, date) => ({
    fullDescription: `Get ready for an explosive gathering at ${name}, hosted by ${churchName}! Designed specifically for youth, students, and young professionals, this summit is about igniting radical purpose, unwavering faith, and authentic community in the next generation.\n\nLed by ${speaker}, this energetic gathering tackles real-life questions about identity, career, relationships, and standing unashamed for Christ in modern culture.`,
    agenda: [
      { time: "04:00 PM", title: "NextGen High-Energy Praise", description: "Atmospheric contemporary worship and youth choir." },
      { time: "05:30 PM", title: "Unashamed: Living on Mission", description: `Inspiring message with ${speaker}.` },
      { time: "07:00 PM", title: "Live Q&A, Small Groups & Prayer", description: "Interactive discussion, peer fellowship, and personal impartation." },
    ],
    speakerBio: `${speaker} is a dynamic youth communicator passionate about seeing students and young adults discover their divine purpose and lead impactful lives for Christ.`,
    socialCaptions: {
      instagram: `⚡ NEXT GEN IS READY! ${name} is coming to you live, hosted by ${churchName} with ${speaker}.\n\n📅 ${date} | Tag your crew and save your spot!\n\nLink in bio! #NextGen #YouthMinistry #Unashamed`,
      whatsapp: `🔥 *YOUTH & YOUNG ADULTS SUMMIT: ${name}* 🔥\n\nCalling the next generation! Join ${speaker} and ${churchName} on ${date} for an epic time in God's presence.\n\nSign up free: `,
      twitter: `Calling all youth & young adults! ${name} is live on ${date} with ${speaker}. Register your crew now:`,
      facebook: `Invite the youth in your family! ${churchName} presents ${name} featuring ${speaker} on ${date}.`,
    },
    ogTitle: `${name} — Youth & Campus Summit`,
    ogDescription: `Igniting the next generation for Christ with ${speaker} and ${churchName}.`,
  }),

  worship_praise: (name, churchName, speaker, date) => ({
    fullDescription: `Immerse yourself in unbroken adoration at ${name}, presented by ${churchName}. Worship is not merely an event — it is an altar where heaven touches earth and the presence of Jesus changes everything.\n\nJoin minister ${speaker} and anointed worship teams for an evening of deep prophetic worship, passionate thanksgiving, and heart-felt adoration that will refresh your soul.`,
    agenda: [
      { time: "06:00 PM", title: "Acoustic Adoration & Opening Exhortation", description: "Drawing near in humble praise." },
      { time: "07:00 PM", title: "Night of Unbroken Worship", description: `Ministering to the heart of God with ${speaker}.` },
      { time: "08:30 PM", title: "Prophetic Ministration & Benediction", description: "Spontaneous songs of the Spirit and closing blessings." },
    ],
    speakerBio: `${speaker} is a psalmist, worship minister, and recording artist dedicated to cultivating atmospheres of deep adoration and spiritual intimacy with God.`,
    socialCaptions: {
      instagram: `🎶 An Evening of Pure Worship! Join ${churchName} for ${name} with ${speaker}.\n\nExperience God's presence and heartfelt praise.\n\n📅 ${date} | Register via link in bio! #Worship #Praise`,
      whatsapp: `🕊️ *NIGHT OF WORSHIP: ${name}* 🕊️\n\nJoin ${churchName} & *${speaker}* for an unforgettable encounter in praise and adoration.\n\n🗓 ${date}\nRegister: `,
      twitter: `Enter into His presence at ${name} with ${speaker} on ${date}. Free online registration:`,
      facebook: `Join ${churchName} for a soul-refreshing night of worship at ${name} featuring ${speaker}.`,
    },
    ogTitle: `${name} — Night of Worship & Praise`,
    ogDescription: `Encounter the presence of God in unbroken praise with ${speaker} and ${churchName}.`,
  }),

  womens_conference: (name, churchName, speaker, date) => ({
    fullDescription: `${name} is a signature women's gathering hosted by ${churchName}, created to nurture, empower, and inspire women across every season of life. Whether you are navigating motherhood, career, ministry, or personal transitions, God's grace is more than sufficient.\n\nMinistered by ${speaker}, this conference offers an uplifting space of sisterhood, biblical wisdom, and transformative prayer to help you flourish in your divine assignment.`,
    agenda: [
      { time: "09:30 AM", title: "Morning Devotion & Sisterhood Welcome", description: "Warm welcome, opening prayer, and worship." },
      { time: "11:00 AM", title: "Main Session: Arise, Shine & Flourish", description: `Inspiring keynote by ${speaker}.` },
      { time: "01:30 PM", title: "Real Talk Panel & Targeted Prayer", description: "Practical discussions on balance, wellness, and kingdom impact." },
    ],
    speakerBio: `${speaker} is an influential teacher, author, and mentor passionate about empowering women to thrive spiritually, emotionally, and vocationally.`,
    socialCaptions: {
      instagram: `🌸 ARISE & FLOURISH! ${name} is here! Hosted by ${churchName} featuring ${speaker}.\n\nTag your sisters, daughters, and friends! 📅 ${date}\n\nRegister via link in bio! #WomensConference #Faith`,
      whatsapp: `👑 *WOMEN'S SUMMIT: ${name}* 👑\n\nJoin ${churchName} and *${speaker}* on ${date} for a life-giving women's conference.\n\nSave your spot: `,
      twitter: `An empowering gathering for women of faith: ${name} with ${speaker} on ${date}. Register free now:`,
      facebook: `We invite every woman to join ${churchName} for ${name} with ${speaker} on ${date}. Expect encouragement and sisterhood!`,
    },
    ogTitle: `${name} — Women's Empowerment Gathering`,
    ogDescription: `Inspiring and equipping women of faith with ${speaker} and ${churchName}.`,
  }),

  evangelism_outreach: (name, churchName, speaker, date) => ({
    fullDescription: `${name} is an outreach summit hosted by ${churchName} aimed at mobilizing the church for the Great Commission. The harvest is plentiful! This conference ignites believers with fresh evangelistic zeal and equips them with effective, compassionate tools to share Christ in their communities.\n\nLed by ${speaker}, you will receive soul-stirring messages on the heart of God for the lost, personal witnessing in the digital age, and practical kingdom outreach.`,
    agenda: [
      { time: "10:00 AM", title: "The Heartbeat of the Father for the Lost", description: `Soul-stirring message by ${speaker}.` },
      { time: "11:45 AM", title: "Modern Outreach & Community Engagement", description: "Practical methods to impact your city and workplace." },
      { time: "01:30 PM", title: "Evangelistic Commissioning & Prayer", description: "Anointing for boldness and fruitfulness in harvest work." },
    ],
    speakerBio: `${speaker} is an evangelist and missionary who has mobilized thousands for global outreach and community transformation through the Gospel of Jesus Christ.`,
    socialCaptions: {
      instagram: `🌍 REACH THE WORLD! Join ${churchName} for ${name} featuring ${speaker}.\n\nBe equipped for the Great Commission in your generation.\n\n📅 ${date} | Link in bio! #Evangelism #Outreach #Missions`,
      whatsapp: `📢 *EVANGELISM SUMMIT: ${name}* 📢\n\nJoin ${churchName} & *${speaker}* on ${date} to be ignited with passion for souls and community impact.\n\nRegister free: `,
      twitter: `Be equipped for modern evangelism at ${name} with ${speaker} on ${date}. Register now:`,
      facebook: `Join ${churchName} for ${name} with ${speaker} on ${date}. Let's reach our world together!`,
    },
    ogTitle: `${name} — Evangelism & Outreach Gathering`,
    ogDescription: `Mobilizing believers for the Great Commission with ${speaker} and ${churchName}.`,
  }),

  default: (name, churchName, speaker, date) => ({
    fullDescription: `Welcome to ${name}, a premier spiritual conference organized by ${churchName}. This gathering brings together believers from all walks of life for a powerful time of worship, biblical instruction, and fellowship in the Holy Spirit.\n\nFeaturing keynote ministry by ${speaker}, attendees will receive practical wisdom, renewed faith, and divine encouragement to excel in their calling and impact their world for Christ.`,
    agenda: [
      { time: "09:00 AM", title: "Opening Celebration & Praise", description: "Gathering in thanksgiving and high praise." },
      { time: "10:30 AM", title: "Keynote Ministration", description: `Word of faith and inspiration with ${speaker}.` },
      { time: "01:00 PM", title: "Prayer, Breakthrough & Benediction", description: "Corporate intercession and closing blessing." },
    ],
    speakerBio: `${speaker} is a dedicated minister of the Gospel committed to empowering believers through clear, practical, and Spirit-led biblical teaching.`,
    socialCaptions: {
      instagram: `✨ Save the Date! Join ${churchName} for ${name} featuring ${speaker}.\n\n📅 ${date} | Online Gathering\n\nRegister via link in bio! #${name.replace(/[^a-zA-Z0-9]/g, "")}`,
      whatsapp: `📢 *${name.toUpperCase()}* 📢\n\n${churchName} invites you to our online conference with *${speaker}* on ${date}!\n\nRegister free: `,
      twitter: `Join ${churchName} for ${name} with ${speaker} on ${date}. Free online registration:`,
      facebook: `Join us online for ${name}! Hosted by ${churchName} with special speaker ${speaker} on ${date}.`,
    },
    ogTitle: `${name} — Special Online Gathering`,
    ogDescription: `Join ${churchName} and ${speaker} for an inspiring conference on ${date}.`,
  }),
};

export function getVariantContent(
  theme: string,
  name: string,
  churchName: string,
  speaker: string,
  date: string
): ConferenceContentVariant {
  const normalized = (theme || "").toLowerCase();

  let matchedKey = "default";

  if (normalized.includes("revival") || normalized.includes("healing") || normalized.includes("miracle")) {
    matchedKey = "revival_healing";
  } else if (normalized.includes("prophet") || normalized.includes("prayer") || normalized.includes("intercession")) {
    matchedKey = "prophetic_prayer";
  } else if (normalized.includes("leader") || normalized.includes("ministry") || normalized.includes("pastor")) {
    matchedKey = "leadership_ministry";
  } else if (normalized.includes("youth") || normalized.includes("campus") || normalized.includes("student") || normalized.includes("young")) {
    matchedKey = "youth_campus";
  } else if (normalized.includes("worship") || normalized.includes("praise") || normalized.includes("music")) {
    matchedKey = "worship_praise";
  } else if (normalized.includes("women") || normalized.includes("ladies") || normalized.includes("sister")) {
    matchedKey = "womens_conference";
  } else if (normalized.includes("evangelism") || normalized.includes("outreach") || normalized.includes("mission") || normalized.includes("soul")) {
    matchedKey = "evangelism_outreach";
  }

  const generator = PREBUILT_VARIANTS[matchedKey] || PREBUILT_VARIANTS.default;
  return generator(name || "Conference", churchName || "Our Church", speaker || "Guest Speaker", date || "Upcoming Date");
}
