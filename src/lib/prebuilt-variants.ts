export interface ConferenceContentVariant {
  fullDescription: string;
  agenda: { time: string; title: string; description: string }[];
  speakerBio: string;
  socialCaptions: {
    instagram: string;
    whatsapp: string;
    twitter: string;
    facebook: string;
    youtube: string;
  };
  ogTitle: string;
  ogDescription: string;
}

export const PREBUILT_VARIANTS: Record<string, (name: string, churchName: string, speaker: string, date: string) => ConferenceContentVariant> = {
  Revival: (name, churchName, speaker, date) => ({
    fullDescription: `Welcome to ${name}, an extraordinary spiritual gathering hosted by ${churchName}. We believe we are in a season where God is pouring out His Spirit afresh upon all flesh. This conference is designed for believers who hunger for deeper intimacy with God, genuine spiritual awakening, and a fresh baptism of holy fire.\n\nOver the course of this powerful gathering, ministered by ${speaker}, expect heavy atmospheres of worship, incisive prophetic teaching, and intense prayer sessions that break yokes. Come prepared to encounter the tangible presence of God, break free from spiritual stagnation, and step into the fullness of your divine destiny.`,
    agenda: [
      { time: "09:00 AM", title: "Opening Worship & consecration", description: "Laying the altar, deep adoration, and atmospheric worship." },
      { time: "10:30 AM", title: "Keynote Ministration: The Fire of Revival", description: `Anointing for spiritual awakening with ${speaker}.` },
      { time: "01:00 PM", title: "Prophetic Prayer & Altar Call", description: "Targeted intercession for personal breakthrough and territorial revival." },
      { time: "03:30 PM", title: "Impartation & Commissioning", description: "Laying on of hands and equipping believers for kingdom impact." },
    ],
    speakerBio: `${speaker} is an anointed voice called to proclaim revival and spiritual awakening to this generation. With years of dedicated ministry, ${speaker} carries a passion for prayer, the manifestation of the Holy Spirit, and equipping believers to live transformed lives.`,
    socialCaptions: {
      instagram: `🔥 REVIVAL IS HERE! Join us for ${name} hosted by ${churchName}.\n\nGod is moving in a mighty way, and we are expecting supernatural encounters with minister ${speaker}.\n\n📅 Date: ${date}\n📍 Location: Online Livestream\n\n👉 Click the link in bio to register for free! #Revival #${name.replace(/\s+/g, "")} #${churchName.replace(/\s+/g, "")} #HolySpirit`,
      whatsapp: `🙌 *${name.toUpperCase()}* 🙌\n\n${churchName} invites you to an unmissable revival conference with *${speaker}*!\n\nExpect worship, miracles, and the fire of God 🔥\n\n🗓 Date: ${date}\n💻 Online Stream\n\nRegister free here: `,
      twitter: `Ready for a fresh move of God? ${name} is coming up on ${date} with ${speaker}! Don't miss out on this atmospheric revival gathering. Register now:`,
      facebook: `We invite you, your family, and friends to join ${churchName} for ${name}! We are believing God for salvation, healing, and spiritual renewal. Speaker: ${speaker}. Register free today!`,
      youtube: `Join ${churchName} for ${name} featuring minister ${speaker}. Live stream starting ${date}. Make sure to subscribe and click the bell for notifications!`,
    },
    ogTitle: `${name} — Revival & Spiritual Encounter`,
    ogDescription: `Join ${churchName} and minister ${speaker} on ${date} for an outpouring of the Holy Spirit.`,
  }),

  Prophetic: (name, churchName, speaker, date) => ({
    fullDescription: `${name} is a prophetic summit convened by ${churchName} to release divine clarity, kingdom instruction, and spiritual insight for the season ahead. God speaks when His people gather in faith. Under the prophetic ministry of ${speaker}, this event will align hearts with heaven's decrees.\n\nAttendees will experience atmosphere-shifting worship, precise prophetic teaching, and intense times of prayer where mysteries are revealed and destinies are activated.`,
    agenda: [
      { time: "10:00 AM", title: "High Praise & Prophetic Atmosphere", description: "Setting the spiritual climate through prophetic song and declaration." },
      { time: "11:30 AM", title: "Unveiling Heaven's Blueprint", description: `Deep prophetic teaching and insight with ${speaker}.` },
      { time: "02:00 PM", title: "Prophetic Presbytery & Prayer", description: "Personal and territorial prophetic ministry and intercession." },
    ],
    speakerBio: `${speaker} is a prophetic teacher recognized for clarity, biblical accuracy, and spiritual discernment. ${speaker} is committed to building up the body of Christ through the prophetic word and sound doctrine.`,
    socialCaptions: {
      instagram: `🔮 Divine Direction & Alignment! Join ${churchName} for ${name} featuring ${speaker}.\n\n📅 ${date} | Online Gathering\n\nLink in bio to register! #${name.replace(/\s+/g, "")} #Prophetic #Kingdom`,
      whatsapp: `✨ *PROPHETIC SUMMIT: ${name}* ✨\n\nReceive clarity for your next season with ${speaker} & ${churchName}.\n\nDate: ${date}\nLink to join: `,
      twitter: `Receive prophetic clarity and spiritual direction at ${name} with ${speaker} on ${date}. Save your spot now!`,
      facebook: `God has a word for your season! ${churchName} invites you to ${name} with ${speaker} on ${date}. Register for free today.`,
      youtube: `Prophetic Conference: ${name} hosted by ${churchName}. Speaker: ${speaker}. Streaming live ${date}.`,
    },
    ogTitle: `${name} — Prophetic Summit`,
    ogDescription: `Unveiling divine direction with ${speaker} and ${churchName}.`,
  }),

  Healing: (name, churchName, speaker, date) => ({
    fullDescription: `Experience the healing power of Jesus Christ at ${name}, hosted by ${churchName}. By His stripes we are healed! Whether you are seeking physical healing, emotional restoration, or deliverance from long-standing oppression, God's grace is present to make you whole.\n\nJoin us as ${speaker} ministers the Word of faith and prays for the sick. Expect tangible miracles, testimonies, and freedom.`,
    agenda: [
      { time: "05:00 PM", title: "Faith Activation Worship", description: "Building faith through testimonies and praise." },
      { time: "06:00 PM", title: "The Word of Healing & Wholeness", description: `Anointed teaching by ${speaker}.` },
      { time: "07:30 PM", title: "Healing Service & Deliverance Prayer", description: "Mass prayer for physical, emotional, and spiritual healing." },
    ],
    speakerBio: `${speaker} ministers with a strong emphasis on divine healing, faith, and the compassionate power of Christ. Many have experienced physical restoration and freedom through ${speaker}'s ministry.`,
    socialCaptions: {
      instagram: `🌿 Healing & Miracles! Join ${name} with ${speaker} and ${churchName}.\n\nGod is still in the miracle business! 📅 ${date}\n\nRegister via link in bio! #Healing #Miracles #Faith`,
      whatsapp: `🕊️ *HEALING & MIRACLE SERVICE: ${name}* 🕊️\n\nAre you or a loved one trusting God for a miracle? Join ${speaker} and ${churchName} on ${date}.\n\nRegister free: `,
      twitter: `Jesus still heals! Join ${churchName} for ${name} with ${speaker} on ${date}. Expect your miracle!`,
      facebook: `Believe God for your miracle! Join ${churchName} for ${name} with ${speaker} on ${date}. All are welcome!`,
      youtube: `Healing Conference ${name} with ${speaker}. Live stream starting ${date}.`,
    },
    ogTitle: `${name} — Divine Healing & Miracles`,
    ogDescription: `Believing God for supernatural healing and restoration with ${speaker}.`,
  }),

  Youth: (name, churchName, speaker, date) => ({
    fullDescription: `${name} is an explosive youth and young adults gathering hosted by ${churchName}! Designed to ignite purpose, unashamed faith, and radical leadership in the next generation. Ministered by ${speaker}, this gathering will empower young people to stand strong in a modern world.`,
    agenda: [
      { time: "04:00 PM", title: "NextGen High Energy Worship", description: "Contemporary praise and youth choir." },
      { time: "05:30 PM", title: "Unashamed: Living With Purpose", description: `Inspiring message with ${speaker}.` },
      { time: "07:00 PM", title: "Q&A & Impartation Session", description: "Interactive talk, prayer, and community." },
    ],
    speakerBio: `${speaker} is a dynamic youth communicator passionate about seeing young lives transformed by the Gospel and living with unashamed kingdom purpose.`,
    socialCaptions: {
      instagram: `⚡ NEXT GEN FIRE! ${name} is coming! Hosted by ${churchName} with ${speaker}.\n\n📅 ${date} | Don't come alone, bring your squad!\n\nLink in bio! #Youth #Unashamed #NextGen`,
      whatsapp: `🔥 *YOUTH SUMMIT: ${name}* 🔥\n\nCalling all young adults! Join ${speaker} and ${churchName} on ${date} for an unforgettable night.\n\nSign up: `,
      twitter: `Calling the NextGen! ${name} is live on ${date} with ${speaker}. Register your squad now:`,
      facebook: `Invite the youth! ${churchName} presents ${name} with ${speaker} on ${date}.`,
      youtube: `Youth & Young Adults Conference: ${name} with ${speaker}. Live on ${date}.`,
    },
    ogTitle: `${name} — Youth & Young Adults Summit`,
    ogDescription: `Igniting the next generation for Christ with ${speaker} and ${churchName}.`,
  }),

  Default: (name, churchName, speaker, date) => ({
    fullDescription: `Welcome to ${name}, a premier online conference organized by ${churchName}. This special event brings together believers from all walks of life for a powerful time of worship, biblical instruction, and kingdom fellowship.\n\nFeaturing minister ${speaker}, attendees will receive practical and spiritual wisdom to navigate their faith walk, build strong families, and fulfill their God-given assignment.`,
    agenda: [
      { time: "09:00 AM", title: "Praise & Thanksgiving", description: "Opening celebration and worship." },
      { time: "10:30 AM", title: "Main Session: Building for Eternity", description: `Teaching by ${speaker}.` },
      { time: "01:00 PM", title: "Closing Prayer & Benediction", description: "Blessing and final word." },
    ],
    speakerBio: `${speaker} is a dedicated minister of the Gospel committed to empowering believers through clear, practical biblical teaching.`,
    socialCaptions: {
      instagram: `✨ Save the Date! Join ${churchName} for ${name} featuring ${speaker}.\n\n📅 ${date}\n\nRegister via link in bio!`,
      whatsapp: `📢 *${name.toUpperCase()}* 📢\n\n${churchName} invites you to our online conference with ${speaker} on ${date}!\n\nRegister free: `,
      twitter: `Join ${churchName} for ${name} with ${speaker} on ${date}. Free online registration:`,
      facebook: `Join us online for ${name}! Hosted by ${churchName} with special speaker ${speaker} on ${date}.`,
      youtube: `${name} hosted by ${churchName} featuring ${speaker}. Streaming live ${date}.`,
    },
    ogTitle: `${name} — Online Conference`,
    ogDescription: `Join ${churchName} and ${speaker} for an inspiring conference on ${date}.`,
  }),
};

export function getVariantContent(theme: string, name: string, churchName: string, speaker: string, date: string): ConferenceContentVariant {
  const key = Object.keys(PREBUILT_VARIANTS).find(k => k.toLowerCase() === theme?.toLowerCase()) || "Default";
  return PREBUILT_VARIANTS[key](name, churchName, speaker, date);
}
