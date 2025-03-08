
import Image from "next/image"

export function WhatsAppButton() {
  const phoneNumber = "+919465172269" 
  const message = "Hi! I'm interested in home tutoring services."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="group fixed bottom-6 right-6 z-50">
      {/* Message Bubble */}
      <div className="absolute bottom-full right-0 mb-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="relative w-48 rounded-lg bg-white p-3 text-sm text-gray-800 shadow-lg">
          <p className="font-medium">Need help with tutoring?</p>
          <p className="mt-1 text-xs text-gray-600">Chat with us on WhatsApp!</p>
          {/* Triangle */}
          <div className="absolute bottom-[-6px] right-6 size-3 rotate-45 bg-white"></div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-full bg-green-500 p-3 text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-green-600"
      >
        <Image 
          src="/icons/whatsapp.svg" 
          alt="WhatsApp"
          width={28}
          height={28}
          className="text-white"
        />
      </a>
    </div>
  )
}
