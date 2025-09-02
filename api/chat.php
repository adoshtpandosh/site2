<?php
header('Content-Type: application/json');

$q = $_GET['q'] ?? '';
if (!$q) { echo json_encode([]); exit; }

$json = json_decode(file_get_contents('data/products.json'), true);
$results = [];

foreach ($json as $row) {
    [$kala, $model, $price, $desc] = $row;
    if (stripos($kala . $model, $q) !== false) {
        $results[] = "$kala ($model) – قیمت: $price تومان – $desc";
    }
}

if (empty($results)) {
    $results[] = "محصولی یافت نشد. لطفاً با ۰۹۳۷۰۷۶۹۱۹۱ یا ۰۹۹۲۱۳۵۲۰۸۸ تماس بگیرید.";
}

echo json_encode($results);
?>
