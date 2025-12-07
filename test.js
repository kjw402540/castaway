const data = {
  user_id: 13,
  emotion_label: "joy",
  softmax: [0.05, 0.80, 0.05, 0.05, 0.05],
  keyword1: "친구",
  keyword2: "만남",
  embedding: Array(384).fill(0.01),
  diary_id: 163
};

fetch("http://localhost:4000/api/emotion/day-vector", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(data)
})
.then(r => r.json())
.then(d => console.log(JSON.stringify(d, null, 2)))
.catch(e => console.error(e.message));
