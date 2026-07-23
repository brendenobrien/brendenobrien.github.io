document.getElementById('year').textContent = new Date().getFullYear();

const sectionSuffixes = { top: '', about: 'about', projects: 'projects', contact: 'contact' };
const sectionOrder = { top: 0, about: 1, projects: 2, contact: 3 };

const track = document.getElementById('suffix-track');
const divider = document.getElementById('path-divider');
let currentSection = 'top';
const SLOT_HEIGHT = '1.2em';
let pendingClean = null;

finalizeTrack(sectionSuffixes[currentSection]);

function finalizeTrack(suffix) {
	track.style.transition = 'none';
	track.innerHTML = '';
	const finalSlot = document.createElement('span');
	finalSlot.className = 'suffix-slot';
	finalSlot.textContent = suffix;
	track.appendChild(finalSlot);
	track.style.transform = 'translateY(0)';
}
function measureWordWidth(word) {
	const probe = document.createElement('span');
	probe.className = 'suffix-slot';
	probe.style.visibility = 'hidden';
	probe.style.position = 'absolute';
	probe.style.whiteSpace = 'nowrap';
	probe.style.fontFamily = 'var(--font-mono)';
	probe.textContent = word;
	document.body.appendChild(probe);
	const width = probe.offsetWidth;
	document.body.removeChild(probe);
	return width;
}
function updateSuffix(newSection) {
	if (newSection === currentSection || !(newSection in sectionSuffixes)) return;
	if (pendingClean) {
		clearTimeout(pendingClean);
		pendingClean = null;
		finalizeTrack(sectionSuffixes[currentSection]);
	}

	const direction = sectionOrder[newSection] > sectionOrder[currentSection] ? 1 : -1;
	const newSuffix = sectionSuffixes[newSection];
	
	const viewport = document.getElementById('suffix-viewport');
	viewport.style.width = measureWordWidth(newSuffix) + 'px';
	const incoming = document.createElement('span');
	incoming.className = 'suffix-slot';
	incoming.textContent = newSuffix; 

	if (direction === 1) {
		track.appendChild(incoming);
		track.style.transition = 'none';
		track.style.transform = 'translateY(0)';
		void track.offsetHeight;
		track.style.transition = 'transform 0.3s ease';
		track.style.transform = `translateY(-${SLOT_HEIGHT})`;
	} else {
		track.insertBefore(incoming, track.firstChild);
		track.style.transition = 'none';
		track.style.transform = `translateY(-${SLOT_HEIGHT})`;
		void track.offsetHeight;
		track.style.transition = 'transform 0.3s ease';
		track.style.transform = 'translateY(0)';
	}

	pendingClean = setTimeout(() => {
		finalizeTrack(newSuffix);
	}, 300);

	divider.style.opacity = newSuffix ? '1' : '0';
	divider.style.width = newSuffix ? '0.6em' : '0';
	currentSection = newSection;
}
const pathObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			updateSuffix(entry.target.id);
		}
	});
}, { rootMargin: '-50% 0px -50% 0px' });

document.querySelectorAll('#top, #about, #projects, #contact').forEach(section => pathObserver.observe(section));

