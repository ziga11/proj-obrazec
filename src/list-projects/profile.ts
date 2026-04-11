import { hydrateApp } from "../utils";

await hydrateApp();

const acc = JSON.parse(localStorage.getItem('user_profile') || '{}');

document.getElementById('user-name')!.textContent = acc.name || 'User';

const avatarImg = document.getElementById('user-avatar') as HTMLImageElement;

if (acc.img_url) {
        avatarImg.onerror = () => {
                console.error('Failed to load image from:', acc.img_url);
                createInitialsAvatar(acc.name || 'User');
        };

        avatarImg.onload = () => {
                avatarImg.style.display = "block";
        };

        avatarImg.referrerPolicy = 'no-referrer';
        avatarImg.src = acc.img_url;
} else {
        console.warn('No img_url found in user profile');
        createInitialsAvatar(acc.name || 'User');
}

function createInitialsAvatar(name: string) {
        const initials = name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

        avatarImg.style.display = 'none';

        const initialsDiv = document.createElement('div');
        initialsDiv.className = 'user-avatar-initials';
        initialsDiv.textContent = initials;

        const userButton = document.getElementById('user-menu-btn');
        userButton?.insertBefore(initialsDiv, userButton.firstChild);
}

document.getElementById('user-menu-btn')?.addEventListener('click', () => {
        const dropdown = document.getElementById('user-dropdown')!;
        const button = document.getElementById('user-menu-btn')!;

        if (dropdown.style.display === 'none') {
                dropdown.style.display = 'block';
                button.classList.add('active');
        } else {
                dropdown.style.display = 'none';
                button.classList.remove('active');
        }
});

document.addEventListener('click', (e) => {
        const menu = document.getElementById('user-menu-btn');
        const dropdown = document.getElementById('user-dropdown');
        if (!menu?.contains(e.target as Node) && !dropdown?.contains(e.target as Node)) {
                dropdown!.style.display = 'none';
                menu?.classList.remove('active');
        }
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
        document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.clear();
        window.location.href = '/pages/login.html';
});
