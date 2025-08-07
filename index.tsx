/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
}

// Module scripts are deferred by default, so the DOM is ready.

// Fade-in animation on scroll
const faders = document.querySelectorAll('.fade-in');
const appearOptions: IntersectionObserverInit = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Formspark AJAX Submission
const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
const formStatus = document.getElementById('form-status') as HTMLParagraphElement | null;
const thankYouModal = document.getElementById('thank-you-modal') as HTMLDivElement | null;
const closeModalButton = document.getElementById('close-modal') as HTMLButtonElement | null;
const FORMSPARK_ACTION_URL = 'https://submit-form.com/De3fQjeT';

if (contactForm) {
  contactForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    if (formStatus) {
        formStatus.textContent = 'Sending...';
        formStatus.style.color = 'var(--medium-text)';
    }

    const formData = new FormData(contactForm);

    try {
        const response = await fetch(FORMSPARK_ACTION_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            if (formStatus) {
                formStatus.textContent = '';
            }
            if(thankYouModal) {
                thankYouModal.classList.remove('hidden');
            }
            contactForm.reset();
            // Reset the Turnstile widget after successful submission
            if (window.turnstile) {
                window.turnstile.reset();
            }
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        if (formStatus) {
            formStatus.textContent = 'Oops! There was a problem. Please try again.';
            formStatus.style.color = '#EF4444'; // Red-500
        }
    }
  });
}

if(closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        if(thankYouModal) {
            thankYouModal.classList.add('hidden');
        }
    });
}

export {};