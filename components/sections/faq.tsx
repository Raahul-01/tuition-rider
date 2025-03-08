"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "What is Tuition Rider?",
    answer: "Tuition Rider is a trusted platform offering online and offline tutoring services for students in grades 1 to 10. We provide personalized education through qualified and experienced teachers."
  },
  {
    question: "How does Tuition Rider work?",
    answer: "We connect students with expert tutors based on their specific academic needs. Parents can choose between online and offline classes. We also offer a free trial class to ensure our services meet your expectations."
  },
  {
    question: "What subjects do you cover?",
    answer: (
      <div className="space-y-2">
        <p>We provide tuition for all major subjects, including:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Primary Grades: All subjects</li>
          <li>Secondary Grades (6-10): Mathematics, Science, English, Social Studies, and more</li>
        </ul>
      </div>
    )
  },
  {
    question: "How are the teachers selected?",
    answer: (
      <div className="space-y-2">
        <p>All our teachers go through a rigorous selection process, including:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Qualification verification</li>
          <li>Subject expertise testing</li>
          <li>Teaching experience review</li>
          <li>Trial sessions to ensure quality</li>
        </ul>
      </div>
    )
  },
  {
    question: "What are your teaching methods?",
    answer: (
      <div className="space-y-2">
        <p>Our teaching methods focus on:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Personalized lesson plans tailored to each student</li>
          <li>Regular assessments to track progress</li>
          <li>Flexible schedules to suit your child&apos;s needs</li>
          <li>Interactive and engaging teaching techniques</li>
        </ul>
      </div>
    )
  },
  {
    question: "What are the fees?",
    answer: (
      <div className="space-y-2">
        <p>Our fees vary depending on:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Grade level</li>
          <li>Number of hours per week</li>
          <li>Mode of tuition (online/offline)</li>
        </ul>
        <p>Fees start at ₹4000. Detailed pricing will be shared during the consultation.</p>
      </div>
    )
  },
  {
    question: "Do you offer trial classes?",
    answer: "Yes! We provide a free trial class so you can evaluate our teaching quality and decide before committing."
  },
  {
    question: "How will I know if my child is making progress?",
    answer: "Our teachers provide regular feedback and progress reports. We also hold periodic parent-teacher meetings to discuss your child's development."
  },
  {
    question: "Are online classes effective?",
    answer: "Absolutely! Our online classes are highly interactive, using tools like whiteboards, video conferencing, and digital resources to ensure the same engagement and effectiveness as offline classes."
  },
  {
    question: "What safety measures are in place for offline tutoring?",
    answer: "All our tutors are verified for background and experience. We also follow strict safety protocols."
  },
  {
    question: "How do I enroll?",
    answer: (
      <div className="space-y-2">
        <p>You can enroll in three easy steps:</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Contact us via call or WhatsApp at 9465172269</li>
          <li>Schedule a free trial class</li>
          <li>Choose your preferred package and start classes</li>
        </ol>
      </div>
    )
  },
  {
    question: "How can I contact Tuition Rider?",
    answer: (
      <div className="space-y-2">
        <p>You can reach us at:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Phone/WhatsApp: <a href="tel:9465172269" className="text-blue-600 hover:underline">9465172269</a></li>
          <li>Email: <a href="mailto:Tuitionrider1@gmail.com" className="text-blue-600 hover:underline">Tuitionrider1@gmail.com</a></li>
          <li>Website: <a href="https://www.Tuitionrider.com" className="text-blue-600 hover:underline">www.Tuitionrider.com</a></li>
        </ul>
      </div>
    )
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  // Split FAQs into two parts
  const leftColumnFaqs = faqs.slice(0, Math.ceil(faqs.length / 2))
  const rightColumnFaqs = faqs.slice(Math.ceil(faqs.length / 2))

  return (
    <section className="relative w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[40%] size-[60%] rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute -bottom-[40%] -right-[10%] size-[60%] rounded-full bg-emerald-100/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[40%] rounded-full bg-gradient-to-br from-blue-100/10 to-emerald-100/10 blur-2xl" />
      </div>

      <MaxWidthWrapper>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Find answers to common questions about our tutoring services
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {leftColumnFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="overflow-hidden rounded-lg border border-white/50 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-emerald-50/50"
                >
                  <span className="text-lg font-medium text-slate-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="size-5 shrink-0 text-blue-600 transition-all duration-300" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="bg-gradient-to-r from-blue-50/30 to-emerald-50/30 p-4 text-slate-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {rightColumnFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index + leftColumnFaqs.length) * 0.1 }}
                className="overflow-hidden rounded-lg border border-white/50 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(index + leftColumnFaqs.length)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-blue-50/50"
                >
                  <span className="text-lg font-medium text-slate-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === (index + leftColumnFaqs.length) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="size-5 shrink-0 text-emerald-600 transition-all duration-300" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {openIndex === (index + leftColumnFaqs.length) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="bg-gradient-to-r from-emerald-50/30 to-blue-50/30 p-4 text-slate-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
