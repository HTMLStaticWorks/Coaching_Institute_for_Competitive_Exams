document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Tab Switching
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Close mobile sidebar if open
            const sidebar = document.querySelector('.dashboard-sidebar');
            if (sidebar && window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Handle hash links from within pages (e.g. clicking "Attempt targeted quiz" button)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash) {
            const targetLink = document.querySelector(`.dashboard-nav a[href="${hash}"]`);
            if (targetLink) {
                targetLink.click();
            }
        }
    });

    // If page is loaded with a hash, click that tab
    if (window.location.hash) {
        const targetLink = document.querySelector(`.dashboard-nav a[href="${window.location.hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
});

// 2. Interactive Mock Test (Quiz Engine)
const quizzes = {
    upsc: {
        title: "UPSC Prelims Diagnostic Mock",
        reviewer: "Sarah Jenkins, B.Tech",
        topicKey: "gs",
        questions: [
            {
                q: "Which Article of the Constitution of India deals with the Emergency provisions?",
                o: ["Article 352-360", "Article 368", "Article 370", "Article 312"],
                a: 0,
                r: "Articles 352 to 360 of Part XVIII of the Constitution deal with Emergency provisions."
            },
            {
                q: "The Cabinet Mission to India in 1946 was headed by:",
                o: ["Stafford Cripps", "A.V. Alexander", "Lord Pethick-Lawrence", "Hugh Gaitskell"],
                a: 2,
                r: "The Cabinet Mission of 1946 was headed by Lord Pethick-Lawrence, the Secretary of State for India."
            },
            {
                q: "Who among the following was the first temporary President of the Constituent Assembly?",
                o: ["Dr. Rajendra Prasad", "Dr. Sachchidanand Sinha", "Dr. B.R. Ambedkar", "Jawaharlal Nehru"],
                a: 1,
                r: "Dr. Sachchidanand Sinha was the temporary President. Later Dr. Rajendra Prasad was elected as President."
            },
            {
                q: "Under which schedules of the Indian Constitution is local self-governance covered?",
                o: ["9th Schedule", "10th Schedule", "11th and 12th Schedule", "8th Schedule"],
                a: 2,
                r: "The 11th and 12th Schedules (added by 73rd & 74th Amendments) deal with Panchayats and Municipalities."
            }
        ]
    },
    jee: {
        title: "JEE Mathematics Core Practice",
        reviewer: "David Chen, B.Tech",
        topicKey: "quant",
        questions: [
            {
                q: "The distance between the parallel lines y = 2x + 4 and y = 2x - 6 is:",
                o: ["2√5", "√5", "10", "2"],
                a: 0,
                r: "Distance d = |c1 - c2| / √(1 + m^2) = |4 - (-6)| / √(1 + 4) = 10 / √5 = 2√5."
            },
            {
                q: "If log₂x + log₄x = 6, then x is:",
                o: ["16", "8", "64", "32"],
                a: 0,
                r: "log₂x + 0.5 log₂x = 6 => 1.5 log₂x = 6 => log₂x = 4 => x = 2⁴ = 16."
            },
            {
                q: "The sum of the infinite geometric series 1 + 1/3 + 1/9 + ... is:",
                o: ["1.5", "2", "1.33", "3"],
                a: 0,
                r: "Sum S = a / (1 - r) = 1 / (1 - 1/3) = 1 / (2/3) = 1.5."
            },
            {
                q: "The slope of the tangent to the curve y = x² - 4x at x = 3 is:",
                o: ["2", "3", "0", "4"],
                a: 0,
                r: "dy/dx = 2x - 4. At x = 3, dy/dx = 2(3) - 4 = 2."
            }
        ]
    },
    neet: {
        title: "NEET Chemistry Theory Mock",
        reviewer: "David Chen, B.Tech",
        topicKey: "chem",
        questions: [
            {
                q: "Which of the following compounds exhibits optical isomerism?",
                o: ["2-Chlorobutane", "1-Chlorobutane", "2-Chloropropane", "Butane"],
                a: 0,
                r: "2-Chlorobutane has a chiral carbon atom (bonded to -H, -Cl, -CH₃, -CH₂CH₃)."
            },
            {
                q: "The hybridization of Carbon in Ethene (C₂H₄) is:",
                o: ["sp³", "sp²", "sp", "dsp²"],
                a: 1,
                r: "Each carbon atom in ethene has three sigma bonds and one pi bond, indicating sp² hybridization."
            },
            {
                q: "Which reaction is used to prepare higher alkanes from alkyl halides?",
                o: ["Wurtz Reaction", "Aldol Condensation", "Friedel-Crafts", "Cannizzaro Reaction"],
                a: 0,
                r: "The Wurtz Reaction involves the coupling of two alkyl halides with sodium in dry ether to form symmetrical alkanes."
            },
            {
                q: "The main product of the reaction between Propene and HBr in the presence of peroxide is:",
                o: ["2-Bromopropane", "1-Bromopropane", "1,2-Dibromopropane", "Propanol"],
                a: 1,
                r: "Peroxides cause Anti-Markovnikov addition of HBr, resulting in 1-Bromopropane as the major product."
            }
        ]
    }
};

let currentQuizKey = null;
let currentQuiz = null;
let currentQuestionIdx = 0;
let score = 0;

function startMockTest(quizKey) {
    currentQuizKey = quizKey;
    currentQuiz = quizzes[quizKey];
    currentQuestionIdx = 0;
    score = 0;

    document.getElementById('quizSelection').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';

    renderQuestion();
}

function renderQuestion() {
    const qData = currentQuiz.questions[currentQuestionIdx];
    document.getElementById('questionTimer').innerText = `Question ${currentQuestionIdx + 1} of ${currentQuiz.questions.length}`;
    document.getElementById('quizTitle').innerText = currentQuiz.title;
    document.getElementById('quizQuestion').innerText = qData.q;

    const optionsDiv = document.getElementById('quizOptions');
    optionsDiv.innerHTML = '';

    qData.o.forEach((opt, idx) => {
        const optionLabel = document.createElement('label');
        optionLabel.style.display = 'flex';
        optionLabel.style.alignItems = 'center';
        optionLabel.style.gap = '12px';
        optionLabel.style.padding = '16px';
        optionLabel.style.border = '1px solid var(--border-color)';
        optionLabel.style.borderRadius = '12px';
        optionLabel.style.cursor = 'pointer';
        optionLabel.style.background = 'var(--card-bg)';
        optionLabel.style.fontWeight = '400';
        optionLabel.style.transition = 'var(--transition)';

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'quizOption';
        radioInput.value = idx;
        radioInput.style.accentColor = 'var(--primary-accent)';

        optionLabel.appendChild(radioInput);
        optionLabel.appendChild(document.createTextNode(opt));

        // Add visual hover and selection classes
        optionLabel.addEventListener('click', () => {
            document.querySelectorAll('#quizOptions label').forEach(l => {
                l.style.borderColor = 'var(--border-color)';
                l.style.background = 'var(--card-bg)';
            });
            optionLabel.style.borderColor = 'var(--primary-accent)';
            optionLabel.style.background = 'rgba(100, 36, 47, 0.03)';
            radioInput.checked = true;
        });

        optionsDiv.appendChild(optionLabel);
    });

    const nextBtn = document.getElementById('nextQuestionBtn');
    if (currentQuestionIdx === currentQuiz.questions.length - 1) {
        nextBtn.innerText = "Finish Exam";
    } else {
        nextBtn.innerText = "Submit Answer";
    }
}

function submitAnswer() {
    const selectedInput = document.querySelector('input[name="quizOption"]:checked');
    if (!selectedInput) {
        alert("Please select an option before proceeding.");
        return;
    }

    const answerIdx = parseInt(selectedInput.value);
    const qData = currentQuiz.questions[currentQuestionIdx];

    if (answerIdx === qData.a) {
        score++;
    }

    currentQuestionIdx++;

    if (currentQuestionIdx < currentQuiz.questions.length) {
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const finalScorePercent = Math.round((score / currentQuiz.questions.length) * 100);
    document.getElementById('quizContainer').style.display = 'none';
    
    const quizResultDiv = document.getElementById('quizResult');
    quizResultDiv.style.display = 'block';

    const scoreText = document.getElementById('quizScoreText');
    scoreText.innerText = `Score: ${finalScorePercent}%`;

    const feedbackText = document.getElementById('quizFeedbackText');
    let feedback = "";
    let statusStr = "Passed";
    let statusClass = "var(--support-accent)";
    
    if (finalScorePercent >= 75) {
        feedback = "Excellent conceptual strength! Your rationales are extremely solid.";
    } else if (finalScorePercent >= 50) {
        feedback = "Good passing score! Focus on slight calculation details to reach top percentiles.";
    } else {
        feedback = "Review Needed. We recommend studying the core syllabus sheets for this topic.";
        statusStr = "Review Needed";
        statusClass = "#F59E0B";
    }
    feedbackText.innerText = feedback;

    // 3. Write record into Logs Table
    const tableBody = document.getElementById('quizLogsTableBody');
    if (tableBody) {
        const newRow = document.createElement('tr');
        newRow.style.borderBottom = '1px solid var(--border-color)';

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${hours}:${minutes} ${ampm}`;

        newRow.innerHTML = `
            <td style="padding: 16px;"><div style="font-weight: 500;">Just Now</div><div style="color: var(--text-secondary); font-size: 13px;">${timeStr}</div></td>
            <td style="padding: 16px;">${currentQuiz.reviewer}</td>
            <td style="padding: 16px;"><span style="background: rgba(100, 36, 47, 0.05); color: var(--primary-accent); padding: 4px 8px; border-radius: 4px; font-size: 13px;">Score: ${finalScorePercent}%</span></td>
            <td style="padding: 16px; color: var(--text-secondary); font-size: 14px; max-width: 300px;">Attempted ${currentQuiz.title}. ${feedback}</td>
            <td style="padding: 16px;"><span style="color: ${statusClass}; font-weight: 500;">${statusStr}</span></td>
        `;
        
        // Insert at top of table logs
        tableBody.insertBefore(newRow, tableBody.firstChild);
    }

    // 4. Update Weak Area Tracking Metrics in Reports
    if (currentQuizKey === 'neet' && finalScorePercent >= 75) {
        // NEET Organic Chemistry was our weak alert. If the user passes it, update UI!
        const chemAcc = document.getElementById('accuracyChem');
        const chemBar = document.getElementById('progressBarChem');
        const alertCard = document.getElementById('weakAreaAlertCard');
        const alertText = document.getElementById('weakAreaAlertText');

        if (chemAcc && chemBar) {
            chemAcc.innerText = `${finalScorePercent}%`;
            chemAcc.style.color = 'var(--secondary-accent)';
            chemBar.style.width = `${finalScorePercent}%`;
            chemBar.style.background = 'var(--secondary-accent)';
        }

        if (alertCard && alertText) {
            alertCard.style.background = 'rgba(5, 150, 105, 0.05)';
            alertCard.style.borderColor = 'rgba(5, 150, 105, 0.2)';
            alertCard.innerHTML = `
                <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #10B981; margin-bottom: 20px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 style="color: #065F46; font-size: 20px; margin-bottom: 12px;">Weak Area Resolved!</h3>
                <p style="color: #047857; font-size: 15px; line-height: 1.6; margin: 0;">Excellent job! Your latest Chemistry mock score of ${finalScorePercent}% indicates you have successfully mastered reaction mechanisms. Keep it up!</p>
            `;
        }

        // Update overall percentile rank
        const rank = document.getElementById('percentileRankText');
        if (rank) {
            rank.innerText = "96th Percentile";
        }
    } else {
        // Update general charts
        const key = currentQuiz.topicKey;
        if (key === 'gs') {
            const el = document.getElementById('accuracyGS');
            const bar = document.getElementById('progressBarGS');
            if (el && bar) {
                el.innerText = `${finalScorePercent}%`;
                bar.style.width = `${finalScorePercent}%`;
            }
        } else if (key === 'quant') {
            const el = document.getElementById('accuracyQuant');
            const bar = document.getElementById('progressBarQuant');
            if (el && bar) {
                el.innerText = `${finalScorePercent}%`;
                bar.style.width = `${finalScorePercent}%`;
            }
        }
    }
}

function exitQuiz() {
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('quizSelection').style.display = 'grid';
}

function resetQuizInterface() {
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizSelection').style.display = 'grid';
}

// 5. Download simulation
function triggerDownload(resourceName) {
    alert(`Success: Preparing "${resourceName}.pdf" for download. The file download has been simulated successfully!`);
}
