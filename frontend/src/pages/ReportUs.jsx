import { useState } from "react";

export default function ReportUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    issueType: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Send to backend API
    console.log("Report Submitted:", form);

    alert("Your report has been submitted. Thank you!");
    setForm({ name: "", email: "", issueType: "", description: "" });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Report an Issue</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
          required
        />

        <select
          name="issueType"
          value={form.issueType}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Select Issue Type</option>
          <option value="bug">Bug / Error</option>
          <option value="feedback">Feedback</option>
          <option value="chatbot_issue">Chatbot Response Issue</option>
          <option value="other">Other</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue…"
          className="w-full p-3 border rounded-lg h-32"
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
        >
          Submit Report
        </button>

      </form>
    </div>
  );
}