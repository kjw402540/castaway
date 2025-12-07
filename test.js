const data = {
  user_id: 13,
  emotion_label: "joy",
  softmax: [0.05, 0.80, 0.05, 0.05, 0.05],
  keyword1: "친구",
  keyword2: "만남",
  embedding: Array(384).fill(0.01),
  diary_id: 163
};

fetch("http://172.31.19.26:8000/emotion/day-vector", {
method: "POST",
headers: {"Content-Type": "application/json"},
body: JSON.stringify(data)
})
.then(r => r.json())
.then(d => console.log(JSON.stringify(d, null, 2)))
.catch(e => console.error(e.message));
