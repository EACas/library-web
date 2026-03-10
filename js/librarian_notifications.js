function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
}

function renderItems(containerId, items, renderFn, emptyMsg) {
  const container = document.getElementById(containerId);
  if (items.length === 0) {
    container.innerHTML = `<p class="empty-msg">${emptyMsg}</p>`;
    return;
  }
  container.innerHTML = items.map(renderFn).join("");
}

async function loadNotifications() {
  try {
    const res  = await fetch("../../php/data/get_notifications.php");
    const data = await res.json();

    // --- DUE DATE REMINDERS ---
    renderItems("remindersContainer", data.reminders, (r) => `
      <div class="notif-item">
        <div class="notif-text">
          <p>Due date reminder — <strong>${r.student_name}</strong></p>
          <small>${r.book_title} — due in ${r.days_until_due} day(s) · ${formatDate(r.due_date)}</small>
        </div>
        <div class="dot reminder"></div>
      </div>`, "No upcoming due dates within 2 days.");

    // --- RESERVED BOOK AVAILABLE ---
    renderItems("availableContainer", data.available, (a) => `
      <div class="notif-item">
        <div class="notif-text">
          <p>Reserved book available — <strong>${a.student_name}</strong> notified</p>
          <small>${a.book_title} is now available · Reserved on ${formatDate(a.date_reserved)}</small>
        </div>
        <div class="dot available"></div>
      </div>`, "No approved reservations with available books.");

    // --- OVERDUE NOTICES ---
    renderItems("overdueContainer", data.overdue, (o) => `
      <div class="notif-item">
        <div class="notif-text">
          <p>Overdue notice — <strong>${o.student_name}</strong></p>
          <small>${o.book_title} — ${o.days_late} day(s) overdue · due ${formatDate(o.due_date)}</small>
        </div>
        <div class="dot overdue"></div>
      </div>`, "No overdue books.");

  } catch (err) {
    console.error(err);
    ["remindersContainer", "availableContainer", "overdueContainer"].forEach(id => {
      document.getElementById(id).innerHTML = `<p class="empty-msg">Error loading data.</p>`;
    });
  }
}

loadNotifications();