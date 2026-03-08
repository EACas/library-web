async function loadConfig() {
  const res  = await fetch("../../php/data/get_config.php");
  const data = await res.json();

  // Library info
  document.getElementById("cfgLibraryName").value   = data.library.library_name;
  document.getElementById("cfgPhone").value          = data.library.phone;
  document.getElementById("cfgEmail").value          = data.library.email;
  document.getElementById("cfgIsOpen").value         = data.library.is_open;

  // Borrowing rules
  document.getElementById("cfgMaxBooks").value       = data.library.allowed_borrowed_books;
  document.getElementById("cfgRateDay").value        = data.library.rate_day;

  // Opening hours
  document.getElementById("cfgFromDay").value        = data.hours.from_day;
  document.getElementById("cfgToDay").value          = data.hours.to_day;
  document.getElementById("cfgStartHour").value      = data.hours.start_hour;
  document.getElementById("cfgEndHour").value        = data.hours.end_hour;

  // Activity log
  const tbody = document.getElementById("activityLogBody");
  tbody.innerHTML = "";

  if (data.logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No activity yet</td></tr>`;
    return;
  }

  const statusLabels = {
    1: { text: "Borrowed",  css: "borrow"  },
    2: { text: "Returned",  css: "return"  },
    3: { text: "Late",      css: "overdue" },
    4: { text: "Reserved",  css: "borrow"  }
  };

  data.logs.forEach(log => {
    const action   = statusLabels[log.status] || { text: "Unknown", css: "" };
    const date     = new Date(log.borrowed_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const due      = new Date(log.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const fine     = log.total_coast ? "$" + parseFloat(log.total_coast).toFixed(2) : "—";

    tbody.innerHTML += `
      <tr>
        <td>${date}</td>
        <td>${log.student_name}</td>
        <td>${log.book_title}</td>
        <td><span class="badge ${action.css}">${action.text}</span></td>
        <td>${due}</td>
        <td>${fine}</td>
      </tr>`;
  });
}

async function saveLibraryInfo() {
  const msg = document.getElementById("infoMessage");
  const res = await fetch("../../php/ac/update_config.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action:       "library_info",
      library_name: document.getElementById("cfgLibraryName").value,
      phone:        document.getElementById("cfgPhone").value,
      email:        document.getElementById("cfgEmail").value,
      is_open:      document.getElementById("cfgIsOpen").value
    })
  });
  const data = await res.json();
  msg.style.color   = data.success ? "green" : "red";
  msg.textContent   = data.message;
}

async function saveBorrowingRules() {
  const msg = document.getElementById("rulesMessage");
  const res = await fetch("../../php/ac/update_config.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action:    "borrowing_rules",
      max_books: document.getElementById("cfgMaxBooks").value,
      rate_day:  document.getElementById("cfgRateDay").value
    })
  });
  const data = await res.json();
  msg.style.color = data.success ? "green" : "red";
  msg.textContent = data.message;
}

async function saveOpeningHours() {
  const msg = document.getElementById("hoursMessage");
  const res = await fetch("../../php/ac/update_config.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action:     "opening_hours",
      from_day:   document.getElementById("cfgFromDay").value,
      to_day:     document.getElementById("cfgToDay").value,
      start_hour: document.getElementById("cfgStartHour").value,
      end_hour:   document.getElementById("cfgEndHour").value
    })
  });
  const data = await res.json();
  msg.style.color = data.success ? "green" : "red";
  msg.textContent = data.message;
}

loadConfig();