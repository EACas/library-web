<?php
header('Content-Type: application/json');
include '../core/database.php';

$genre_name = trim($_POST['genre_name'] ?? '');

if (empty($genre_name)) {
    echo json_encode(["success" => false, "message" => "Genre name is required."]);
    exit;
}

// Check if genre already exists
$check = $conn->prepare("SELECT genre_id FROM genres WHERE genre = ?");
$check->bind_param("s", $genre_name);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Genre already exists."]);
    $check->close();
    exit;
}
$check->close();

$stmt = $conn->prepare("INSERT INTO genres (genre) VALUES (?)");
$stmt->bind_param("s", $genre_name);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>