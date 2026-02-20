# AI-Assisted Programming - Lecture Materials

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/danielcregg/aiap-materials-perplexity?style=flat-square)

An interactive, browser-based slide presentation for a 4th-year Computer Science university lecture on **AI-Assisted Programming**. Built with vanilla HTML, CSS, and JavaScript, the presentation features animated bullet-point reveals, keyboard navigation, responsive design, and data-visualization slides.

---

## Topics Covered

The presentation spans 15 slides and covers:

| Slide | Topic |
|-------|-------|
| 1 | Title / Course introduction |
| 2 | What is AI-Assisted Programming? |
| 3 | The AI programming tool landscape |
| 4--5 | Market growth and industry statistics |
| 6--7 | Company and developer adoption trends |
| 8--10 | Deep dive into GitHub Copilot and impact studies |
| 11 | Benefits of AI-assisted programming |
| 12--14 | Challenges, trust decline, and developer concerns |
| 15 | Future outlook and implications |

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/danielcregg/aiap-materials-perplexity.git
   cd aiap-materials-perplexity
   ```
2. Open `index.html` in your browser, or start a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
3. Navigate to `http://localhost:8000` to view the presentation.

---

## Usage

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Right Arrow / Space | Reveal next bullet point or advance slide |
| Left Arrow | Hide previous bullet point or go back |
| Home | Jump to first slide |
| End | Jump to last slide |
| 1--9, 0 | Jump to slides 1--10 |
| Ctrl + 1--5 | Jump to slides 11--15 |

### Features

- Animated bullet-point reveal with sequential disclosure
- Progress bar indicating overall presentation progress
- Responsive layout for different screen sizes
- Dark mode support (follows system preference)
- Print-friendly styles
- Accessibility support with ARIA announcements and reduced-motion media query

---

## Project Structure

```
aiap-materials-perplexity/
├── index.html       # Slide markup (15 slides)
├── style.css        # Perplexity-inspired design system and slide styles
├── app.js           # Presentation engine (navigation, animations, bullet tracking)
└── *.png            # Chart images used in data-visualization slides
```

---

## License

This project is licensed under the [MIT License](LICENSE).
