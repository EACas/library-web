<?php
header("Content-Type: application/json");

include "../core/database.php";

$sql = "SELECT author_id, author_name FROM authors";

$result = $conn->query($sql);

$authors = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $authors[] = $row;
    }
}

echo json_encode($authors);

$conn->close();
?>