// Set default month to current
document.getElementById("reportMonth").value = new Date().toISOString().slice(0, 7);

// Load summary cards on page load
loadSummary();

async function loadSummary() {
  const res  = await fetch("../../php/data/get_report_summary.php");
  const data = await res.json();

  document.getElementById("statTotal").textContent   = data.total_transactions;
  document.getElementById("statOverdue").textContent = data.overdue_count;
  document.getElementById("statRevenue").textContent = "$" + parseFloat(data.fine_revenue).toFixed(2);
}

async function runReport() {
  const type    = document.getElementById("reportType").value;
  const month   = document.getElementById("reportMonth").value;
  const msg     = document.getElementById("reportMessage");
  const tbody   = document.getElementById("reportTableBody");

  tbody.innerHTML = `<tr><td colspan="7">Loading...</td></tr>`;
  msg.textContent = "";

  const params = new URLSearchParams({ type, month });

  try {
    const res  = await fetch(`../../php/data/get_report.php?${params.toString()}`);
    const data = await res.json();

    if (!data.success) {
      tbody.innerHTML = `<tr><td colspan="7">${data.message}</td></tr>`;
      return;
    }

    if (data.records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">No records found for this filter.</td></tr>`;
      return;
    }

    // Store for CSV export
    window._reportData = data.records;

    const actionLabels = {
      1: { text: "Borrowed",   css: "borrow"  },
      2: { text: "Returned",   css: "return"  },
      3: { text: "Late Return", css: "overdue" }
    };

    tbody.innerHTML = "";
    data.records.forEach(r => {
      const date   = new Date(r.borrowed_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const due    = new Date(r.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const action = actionLabels[r.status] ?? { text: "Unknown", css: "" };
      const fine   = r.total_coast ? "$" + parseFloat(r.total_coast).toFixed(2) : "—";

      tbody.innerHTML += `
        <tr>
          <td>${date}</td>
          <td>${r.student_name}</td>
          <td>${r.user_library_id}</td>
          <td>${r.book_title}</td>
          <td><span class="badge ${action.css}">${action.text}</span></td>
          <td>${due}</td>
          <td>${fine}</td>
        </tr>`;
    });

    msg.style.color = "green";
    msg.textContent = `${data.records.length} record(s) found.`;

  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="7">Error loading report.</td></tr>`;
  }
}

function exportCSV() {
  const records = window._reportData;
  if (!records || records.length === 0) {
    alert("Run a report first before exporting.");
    return;
  }

  const headers = ["Date", "Student", "Student ID", "Book", "Action", "Due Date", "Fine"];
  const actionLabels = { 1: "Borrowed", 2: "Returned", 3: "Late Return" };

  const rows = records.map(r => [
    new Date(r.borrowed_time).toLocaleDateString(),
    r.student_name,
    r.user_library_id,
    r.book_title,
    actionLabels[r.status] ?? "Unknown",
    new Date(r.due_date).toLocaleDateString(),
    r.total_coast ? "$" + parseFloat(r.total_coast).toFixed(2) : "—"
  ]);

  const csv     = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(",")).join("\n");
  const blob    = new Blob([csv], { type: "text/csv" });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement("a");
  const month   = document.getElementById("reportMonth").value;
  const type    = document.getElementById("reportType").value;

  a.href     = url;
  a.download = `report_${type}_${month}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}