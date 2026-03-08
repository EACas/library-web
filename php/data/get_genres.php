<?php
header("Content-Type: application/json");

require_once "../core/database.php";

$sql = "SELECT genre_id, genre FROM genres ORDER BY genre";

$result = $conn->query($sql);

$genres = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $genres[] = $row;
    }
}

echo json_encode($genres);

$conn->close();
?>