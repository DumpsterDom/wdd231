document.addEventListener('DOMContentLoaded', function () {
    // === Hamburger Menu ===
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !expanded);
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // === Footer ===
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const lastMod = document.getElementById('lastModified');
    if (lastMod) lastMod.textContent = 'Last Modified: ' + document.lastModified;

    // === Course Data Array ===
    const courses = [
        { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
        { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
        { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
        { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false },
        { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
        { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, completed: false }
    ];

    // === DOM Elements ===
    const courseGrid = document.getElementById('course-grid');
    const totalCreditsEl = document.getElementById('total-credits');
    const filterButtons = document.querySelectorAll('.filter-buttons button');

    // ===  Courses ===
    function renderCourses(courseList) {
        courseGrid.innerHTML = '';
        courseList.forEach(course => {
            const card = document.createElement('div');
            card.className = `course-card ${course.completed ? 'completed' : ''}`;
            card.innerHTML = `
                <h3>${course.subject} ${course.number}</h3>
                <p>${course.title}</p>
                <span class="credits">${course.credits} ${course.credits === 1 ? 'credit' : 'credits'}</span>
            `;
            courseGrid.appendChild(card);
        });

        // Update credits
        const total = courseList.reduce((sum, c) => sum + c.credits, 0);
        totalCreditsEl.textContent = total;
    }

    // ===  Filter ===
    function filterCourses(filter) {
        let filtered;
        if (filter === 'all') {
            filtered = courses;
        } else {
            filtered = courses.filter(c => c.subject === filter);
        }
        renderCourses(filtered);
    }

    // === Button Event ===
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            filterCourses(filter);
        });
    });

    filterCourses('all');
});