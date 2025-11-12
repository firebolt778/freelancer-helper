async function getCurrentTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.url;
}

async function fetchFreelancerData(url) {
  const pp = url.split("/");
  const seoUrl = `${pp[4]}/${pp[5]}`;
  const apiUrl = `https://www.freelancer.com/api/projects/0.1/projects?limit=1&seo_urls%5B%5D=${encodeURIComponent(seoUrl)}&client_engagement_details=true`;

  const projRes = await fetch(apiUrl);
  if (!projRes.ok) {
    throw new Error('Failed to fetch project data');
  }

  const project = await projRes.json();
  const ownerid = project.result.projects[0].owner_id;

  const userApiUrl = `https://www.freelancer.com/api/users/0.1/users` +
    `?users[]=${ownerid}` +
    `&avatar=true` +
    `&online_offline_details=true` +
    `&status=true` +
    `&support_status_details=true` +
    `&limited_account=true` +
    `&preferred_details=true` +
    `&rising_star=true` +
    `&shareholder_details=true` +
    `&staff_details=true` +
    `&webapp=1` +
    `&compact=true` +
    `&new_errors=true` +
    `&new_pools=true`;

  const userRes = await fetch(userApiUrl);
  if (!userRes.ok) {
    throw new Error('Failed to fetch user data');
  }

  return await userRes.json();
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getCurrentTimeInTimezone(timezoneString, offsetHours) {
  const now = new Date();
  const userTime = new Date(now.getTime() + (offsetHours * 60 * 60 * 1000));

  return userTime.toLocaleString('en-US', {
    timeZone: timezoneString,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function renderUserInfo(userData) {
  const user = Object.values(userData.users)[0];

  const avatarUrl = user.avatar_xlarge_cdn.startsWith('//')
    ? `https:${user.avatar_xlarge_cdn}`
    : user.avatar_xlarge_cdn;

  const currentTime = getCurrentTimeInTimezone(
    user.timezone.timezone,
    user.timezone.offset
  );

  const registeredDate = formatDate(user.registration_date);

  const location = `${user.location.city}, ${user.location.country.name}`;

  const preferredBadge = user.preferred_freelancer
    ? '<span class="badge preferred">⭐ Preferred Freelancer</span>'
    : '<span class="badge regular">Regular Member</span>';

  const statuses = [
    { label: 'Payment Verified', value: user.status.payment_verified },
    { label: 'Email Verified', value: user.status.email_verified },
    { label: 'Phone Verified', value: user.status.phone_verified },
    { label: 'Identity Verified', value: user.status.identity_verified },
    { label: 'Deposit Made', value: user.status.deposit_made },
    { label: 'Profile Complete', value: user.status.profile_complete },
    { label: 'Facebook Connected', value: user.status.facebook_connected },
    { label: 'LinkedIn Connected', value: user.status.linkedin_connected },
    { label: 'Freelancer Verified', value: user.status.freelancer_verified_user },
    { label: 'Custom Charge Verified', value: user.status.custom_charge_verified },
  ];

  const statusHtml = statuses.map(status => `
    <div class="status-item">
      <span class="status-icon ${status.value ? 'verified' : 'unverified'}"></span>
      <span>${status.label}</span>
    </div>
  `).join('');

  return `
    <div class="profile-header">
      <img src="${avatarUrl}" alt="${user.display_name}" class="avatar" onerror="this.src='https://via.placeholder.com/80'">
      <div class="profile-names">
        <h2>${user.public_name || user.display_name}</h2>
        <a target="_blank" href="https://www.freelancer.com/u/${user.username}?w=f">
          @${user.username}
        </a>
      </div>
    </div>
    
    <div class="info-section">
      ${preferredBadge}
    </div>
    
    <div class="info-section">
      <div class="info-label">Location</div>
      <div class="info-value">${location}</div>
    </div>
    
    <div class="info-section">
      <div class="info-label">Current Time</div>
      <div class="info-value">${currentTime} (${user.timezone.timezone})</div>
    </div>
    
    <div class="info-section">
      <div class="info-label">Registered</div>
      <div class="info-value">${registeredDate}</div>
    </div>
    
    <div class="info-section">
      <div class="info-label">Account Status</div>
      <div class="status-grid">
        ${statusHtml}
      </div>
    </div>
  `;
}

async function init() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('content');

  try {
    const currentUrl = await getCurrentTabUrl();

    if (!currentUrl.startsWith("https://www.freelancer.com/projects/")) {
      return;
    }

    const data = await fetchFreelancerData(currentUrl);

    if (data.status === 'success' && data.result.users) {
      contentEl.innerHTML = renderUserInfo(data.result);
      loadingEl.style.display = 'none';
      contentEl.style.display = 'block';
    } else {
      throw new Error('Invalid data structure');
    }
  } catch (error) {
    console.error('Error:', error);
    loadingEl.style.display = 'none';
    errorEl.textContent = `Error: ${error.message}`;
    errorEl.style.display = 'block';
  }
}

init();