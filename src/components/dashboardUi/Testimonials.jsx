import React, { useState } from 'react';

export default function Testimonials({testimonials = []}) {
  const [formData,setFormData] = useState({name:'',message:''});
  const [allTestimonials,setAllTestimonials] =useState(testimonials);
  const[submitted,setSubmitted] =useState(false);
   
  const handleChange =(e) => {
    const {name,value} =e.target;
    setFormData(prev =>({...prev,[name]:value}));
  };

  const handleSubmit =(e) => {
    e.preventDefault();//prevent page reload
  

  const newTestimonial ={
    id:allTestimonials.length+1,
    name:formData.name,
    message:formData.message,
    date: new Date().toISOString().split('T')[0],//format :"YYYY-MM-DD"
  };
  
  setAllTestimonials([newTestimonial,...allTestimonials]);// add new one to top
  setFormData({name:'',message:''});//reset form
  setSubmitted(true);//show success message

  //remove sucess message after 3 seconds
  setTimeout(() => setFormData(false),3000);

}

  

  
  return (
    <div className="space-y-8">
      {/* List of Testimonials */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">User Testimonials</h2>
        {allTestimonials.length === 0 ? (
          <p className="text-gray-500">No testimonials yet.</p>
        ) : (
          <ul className="space-y-4">
            {allTestimonials.map(t => (
              <li key={t.id} className="border-b pb-4">
                <p className="text-gray-800">"{t.message}"</p>
                <div className="text-sm text-gray-600 mt-1">
                  — {t.name}, {t.date}
                </div>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="message"
            placeholder="Your Testimonial"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

          {submitted && (
            <p className="text-green-600 mt-2">✅ Thank you for your feedback!</p>
          )}
        </form>
      </div>
    </div>
  );
}
