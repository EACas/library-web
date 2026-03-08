async function loadDashboard() {
  const res = await fetch("../../php/data/get_dashboard_data.php");
  const data = await res.json();

  // --- STAT CARDS ---
  document.getElementById("statTotalBooks").textContent       = data.total_books.toLocaleString();
  document.getElementById("statBorrowed").textContent         = data.currently_borrowed.toLocaleString();
  document.getElementById("statAvailable").textContent        = "Available: " + (data.total_books - data.currently_borrowed).toLocaleString();
  document.getElementById("statOverdue").textContent          = data.overdue_count.toLocaleString();
  document.getElementById("statFineRevenue").textContent      = "$" + data.fine_revenue.toFixed(2);

  // --- BOOKS PER GENRE ---
  const genreContainer = document.getElementById("genreContainer");
  genreContainer.innerHTML = "";
  data.books_per_genre.forEach(g => {
    genreContainer.innerHTML += `
      <div class="genre-row">
        <span class="genre-label">${g.genre}</span>
        <div class="genre-bar-bg">
          <div class="genre-bar" style="width:${g.percentage}%"></div>
        </div>
        <span class="genre-count">${g.count}</span>
      </div>`;
  });

  // --- OVERDUE REPORTS ---
  const overdueBody = document.getElementById("overdueTableBody");
  overdueBody.innerHTML = "";
  if (data.overdue_reports.length === 0) {
    overdueBody.innerHTML = `<tr><td colspan="6">No overdue books</td></tr>`;
  } else {
    data.overdue_reports.forEach(r => {
      const due = new Date(r.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      overdueBody.innerHTML += `
        <tr>
          <td>${r.student_name}</td>
          <td>${r.book_title}</td>
          <td>${due}</td>
          <td>${r.days_late} days</td>
          <td>$${parseFloat(r.fine).toFixed(2)}</td>
          <td><span class="badge overdue">Overdue</span></td>
        </tr>`;
    });
  }

  // --- BORROWING TRENDS ---
  const trendsBody = document.getElementById("trendsTableBody");
  trendsBody.innerHTML = "";
  if (data.borrowing_trends.length === 0) {
    trendsBody.innerHTML = `<tr><td colspan="4">No borrowing data</td></tr>`;
  } else {
    data.borrowing_trends.forEach(s => {
      const activeBadge = s.active > 0
        ? `<span class="badge borrowed">${s.active} Active</span>`
        : `<span class="badge ok">All Returned</span>`;
      trendsBody.innerHTML += `
        <tr>
          <td>${s.student_name}</td>
          <td>${s.total_borrowed}</td>
          <td>${s.returned}</td>
          <td>${activeBadge}</td>
        </tr>`;
    });
  }
}

loadDashboard();