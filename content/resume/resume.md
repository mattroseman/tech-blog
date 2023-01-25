---
type: resume
date: 2022-10-21
author: matthewroseman
---

# Matthew Roseman

## Education
#### Case Western Reserve University
Graduated May 2017 | Cleveland, OH<br>
BA in Computer Science<br>
Minor in Mathematics

---

## Experience
### Hubspot
**May 2021 - Nov 2022** | Backend Software Engineer | Remote

I worked on the Content Setup team, which was responsible for the transferring of user's blogs, knowledge bases, and site pages from their old sites into their HubSpot CMS.

- **Form Extractor**: Built extractor to scrape forms off customer's website and add to their HubSpot CMS
  - Wrote a heuristic algorithm able to accurately extract human readable labels associated from forms. Worked on most major third party form builders.
- **Web Crawler**: Debugged and worked with a web crawler built on Internet Archive's Heretrix crawler, used throughout HubSpot
- **Debugging**: Debugging system primarily responsible for orchestrating customer's import of content from **99% to 99.99% availability**
- **Work Environment**: Worked remotely in a strongly asynchronous work environment: involved being communicative while taking ownership of the tasks assigned to me
- **On Call**: On Call every three weeks, handling any customer issues, or errors from the code. Including a detailed breakdown shared with the rest of the team

### Find.Jobs
**May 2018 - April 2020** | Full Stack Software Engineer | Cleveland, OH & Remote 

This was a small startup of 10-12 employees. The product was a job board website which had a unique website and domain for every job category, e.g., nursing.jobs, engineering.jobs, ohio.jobs. There was a single pool of jobs, and each website had its own filter.

- **Job Import**: Refactored job import system to handle **~2-3 million** jobs daily in **~1 hour**
  - Included downloading, normalizing multiple data formats, inferring missing fields, and storing jobs in SQL and Elasticsearch
- **Job Filtering**: Added a filtering system to the job boards search
  - Feature parity with Indeed's job filtering
  - Involved optimized Elasticsearch queries hitting **~10-20 million jobs** in less than a **2-3 seconds**, even in deep pagination
  - Built to be optimized for SEO discoverability
  - Same filtering system was used to dynamically build sitemaps
- **Web Crawler**: Built web crawler tailored to premium customers' smaller job boards
  - Built with Python Scrapy
  - Built to be configurable to the point that adding new customer's websites took **~1 day of work** with no code changes

### Keyfactor
**May 2015–Aug 2015, May 2016–Aug 2016** | Software Engineering Intern | Independence, OH

Medium sized company of ~50 people. Product was an app that helped large companies manage their own site's certificates used for security purposes.

- Worked on general web development features on the frontend and backend, including modifications to a large SQL database
- Worked in ASP.NET with C#
- Work also involved some cursory Cryptography knowledge

---

## Skills

### Languages
<ul class="two-column">
  <li>Python (6 years)</li>
  <li>
    Javascript (6 years)
    <ul>
      <li>ES6+</li>
      <li>Node.js</li>
    </ul>
  </li>
  <li>Java (2 years)</li>
  <li>Ruby</li>
  <li>Go</li>
</ul>

### Databases
<ul class="two-column">
  <li>SQL</li>
  <li>Elasticsearch</li>
  <li>MongoDB</li>
  <li>Redis</li>
</ul>

### Frameworks/Libraries
<ul class="two-column">
  <li>Django (3 years)</li>
  <li>Flask (2 years)</li>
  <li>Scrapy</li>
  <li>Heretrix</li>
  <li>Rabbitpy/Pika</li>
  <li>SQLAlchemy</li>
  <li>React (2 years)</li>
  <li>JQuery</li>
  <li>Bootstrap</li>
  <li>Selenium</li>
  <li>Webpack</li>
  <li>Babel</li>
</ul>

### Infra
- Docker (2 years)
- GCP (2 years)
- Kubernetes
