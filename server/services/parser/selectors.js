// Centralized DOM CSS selectors for different platforms
export default {
  internshala: {
    title: [
      ".profile_heading",
      ".heading_3_5",
      ".heading_4_3",
      "h1"
    ],
    company: [
      ".company_name a.link_display_like_text",
      ".company_name",
      ".heading_6",
      "a.company_name"
    ],
    location: [
      "#location_names",
      ".location_link",
      ".location",
      ".item_body"
    ],
    salary: [
      ".stipend",
      ".salary_container",
      ".stipend_container",
      ".stipend_amount"
    ],
    experience: [
      ".experience",
      ".experience_container",
      ".item_body"
    ],
    skills: [
      ".round_profile",
      ".skills_container span",
      ".skill_tag"
    ],
    description: [
      ".text-container",
      ".job_description_heading + div",
      ".detail_view",
      ".sections"
    ]
  },
  ambitionbox: {
    title: [
      "h1",
      ".job-title",
      "h2.company-name"
    ],
    company: [
      ".company-name",
      ".company-content-wrapper h2",
      ".company-name a",
      "h1"
    ],
    location: [
      ".location",
      ".hq-location",
      ".infoEntity"
    ],
    salary: [
      ".salary",
      ".salary-range",
      ".infoEntity"
    ],
    experience: [
      ".experience",
      ".exp",
      ".infoEntity"
    ],
    skills: [
      ".skills-list span",
      ".skill-tag",
      ".chip"
    ],
    description: [
      ".job-description",
      ".description-body",
      ".company-description"
    ]
  },
  linkedin: {
    title: [
      "h1.top-card-layout__title",
      "h1.topcard__title",
      "h1",
      ".topcard__title-text"
    ],
    company: [
      ".topcard__flavor--metadata a",
      ".top-card-layout__subtitle-link",
      ".company-name",
      ".topcard__flavor a"
    ],
    location: [
      ".topcard__flavor--bullet",
      ".top-card-layout__first-sub-header span:nth-child(2)",
      ".location"
    ],
    salary: [
      ".salary",
      ".compensation",
      ".job-search-card__salary-info"
    ],
    experience: [
      ".experience",
      ".exp-requirement",
      ".job-description"
    ],
    skills: [
      ".skills__tag",
      ".skill-badge",
      ".job-description"
    ],
    description: [
      ".description__text",
      ".show-more-less-html__markup",
      ".job-description",
      ".jobs-description__content"
    ]
  },
  indeed: {
    title: [
      ".jobsearch-JobInfoHeader-title",
      "h1",
      "h2"
    ],
    company: [
      ".jobsearch-CompanyInfoContainer a",
      ".jobsearch-InlineCompanyRating div",
      ".company",
      ".jobsearch-JobInfoHeader-subtitle a"
    ],
    location: [
      ".jobsearch-JobInfoHeader-subtitle div:last-child",
      ".location",
      ".jobsearch-JobInfoHeader-subtitle"
    ],
    salary: [
      "#salaryInfoAndJobType",
      ".salary-snippet",
      ".jobsearch-JobMetadataHeader-item"
    ],
    experience: [
      ".experience-requirement",
      "#jobDescriptionText"
    ],
    skills: [
      ".skill-tag",
      ".jobsearch-ReqsSection span",
      "#jobDescriptionText"
    ],
    description: [
      "#jobDescriptionText",
      ".job-description-section",
      ".jobsearch-jobDescriptionText"
    ]
  },
  naukri: {
    title: [
      ".jd-header-title",
      "h1",
      ".job-title"
    ],
    company: [
      ".jd-header-comp-name a",
      ".company-info a",
      ".companyName"
    ],
    location: [
      ".location a",
      ".loc span",
      ".location"
    ],
    salary: [
      ".salary span",
      ".salary-range",
      ".salary"
    ],
    experience: [
      ".exp span",
      ".experience",
      ".exp"
    ],
    skills: [
      ".key-skill a",
      ".key-skill span",
      ".chip"
    ],
    description: [
      ".job-desc",
      ".job-description",
      ".description"
    ]
  },
  foundit: {
    title: [
      "h1.job-title",
      "h1"
    ],
    company: [
      ".company-name a",
      ".company-name"
    ],
    location: [
      ".location",
      ".job-location"
    ],
    salary: [
      ".salary",
      ".salary-snippet"
    ],
    experience: [
      ".experience",
      ".exp-req"
    ],
    skills: [
      ".skills-tag",
      ".skill-link",
      ".tag"
    ],
    description: [
      ".job-description",
      ".description"
    ]
  }
};
