"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronRight, Search, Sparkles, History, User, Mic, Camera, Store, PlusCircle, Star, MessageSquare, Send, Paperclip, Volume2, X, Image as ImageIcon, ChevronDown, Settings, HelpCircle, Car, MapPin } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const partNames = [
  "pastillas de freno",
  "filtro de aceite",
  "bujías",
  "amortiguadores",
  "correa de distribución",
  "batería",
  "alternador",
  "radiador",
  "bomba de agua",
  "embrague"
]

const sponsoredItems = [
  { id: 1, name: "Pastillas de freno premium", price: 49.99, rating: 4.5, store: "AutoParts Plus", image: "/placeholder.svg?height=100&width=200&text=AutoParts+Plus", brand: "Brembo", storeReputation: 4.8, distance: 2.5 },
  { id: 2, name: "Filtro de aceite de alto rendimiento", price: 12.99, rating: 4.8, store: "MechanicsMaster", image: "/placeholder.svg?height=100&width=200&text=MechanicsMaster", brand: "K&N", storeReputation: 4.6, distance: 3.7 },
  { id: 3, name: "Bujías de iridio", price: 8.99, rating: 4.7, store: "SparkPlugPro", image: "/placeholder.svg?height=100&width=200&text=SparkPlugPro", brand: "NGK", storeReputation: 4.9, distance: 1.8 },
]

const regularItems = [
  { id: 4, name: "Amortiguadores deportivos", price: 89.99, rating: 4.3, store: "SuspensionKing", image: "/placeholder.svg?height=100&width=200&text=SuspensionKing" },
  { id: 5, name: "Correa de distribución duradera", price: 29.99, rating: 4.6, store: "BeltBoss", image: "/placeholder.svg?height=100&width=200&text=BeltBoss" },
  { id: 6, name: "Batería de larga duración", price: 109.99, rating: 4.9, store: "PowerCell", image: "/placeholder.svg?height=100&width=200&text=PowerCell" },
  { id: 7, name: "Alternador reacondicionado", price: 79.99, rating: 4.2, store: "ElectricAuto", image: "/placeholder.svg?height=100&width=200&text=ElectricAuto" },
  { id: 8, name: "Radiador de aluminio", price: 129.99, rating: 4.4, store: "CoolCar", image: "/placeholder.svg?height=100&width=200&text=CoolCar" },
  { id: 9, name: "Bomba de agua de alto flujo", price: 39.99, rating: 4.5, store: "H2OPump", image: "/placeholder.svg?height=100&width=200&text=H2OPump" },
  { id: 10, name: "Kit de embrague completo", price: 199.99, rating: 4.7, store: "ClutchMasters", image: "/placeholder.svg?height=100&width=200&text=ClutchMasters" },
]

export function BlockPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { role: "system", content: "Hola, soy tu asistente virtual de búsqueda de piezas de automóvil. ¿En qué puedo ayudarte hoy?" }
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isIntelligentSearch, setIsIntelligentSearch] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [userCar, setUserCar] = useState(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % partNames.length)
    }, 1500)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setChatMessages(prev => [...prev, { role: "user", content: `Búsqueda: ${searchQuery}` }])
    // Simulate search results
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: "system", content: `Aquí tienes los resultados para "${searchQuery}". ¿Necesitas más información sobre algún producto en particular?` }])
    }, 1000)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.elements.namedItem("chatInput") as HTMLInputElement
    const userMessage = input.value.trim()
    if (userMessage) {
      setChatMessages(prev => [...prev, { role: "user", content: userMessage }])
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: "system", content: `Entiendo que estás interesado en "${userMessage}". ¿Puedes darme más detalles sobre lo que buscas específicamente?` }])
      }, 1000)
      input.value = ""
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setChatMessages(prev => [...prev, { role: "user", content: `Archivo subido: ${file.name}` }])
      // Here you would typically upload the file and process it
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: "system", content: `He recibido tu archivo "${file.name}". ¿Qué te gustaría que haga con él?` }])
      }, 1000)
    }
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording logic here
      console.log("Started recording")
    } else {
      // Stop recording and process audio here
      console.log("Stopped recording")
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: "system", content: "He recibido tu mensaje de voz. Dame un momento para procesarlo." }])
      }, 1000)
    }
  }

  const toggleIntelligentSearch = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsIntelligentSearch(!isIntelligentSearch)
      setIsAnimating(false)
    }, 300)
  }

  const handleAddCar = () => {
    setChatMessages(prev => [
      ...prev,
      { role: "system", content: "Por favor, proporciona la marca, modelo y año del carro que deseas añadir." }
    ])
  }

  const handleAddUserCar = () => {
    // This is a simplified version. In a real application, you'd want to use a form or dialog to collect car details.
    const brand = prompt("Ingresa la marca de tu carro:")
    const model = prompt("Ingresa el modelo de tu carro:")
    const year = prompt("Ingresa el año de tu carro:")
    
    if (brand && model && year) {
      setUserCar({ brand, model, year })
      setChatMessages(prev => [
        ...prev,
        { role: "system", content: `He añadido tu ${brand} ${model} ${year} a tu perfil. Ahora puedo ayudarte a encontrar piezas específicas para tu vehículo.` }
      ])
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 opacity-30 pointer-events-none transition-all duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x / 50}px, ${mousePosition.y / 50}px)`,
        }}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-16 flex-col justify-between border-r bg-white transition-all duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700",
          isOpen && "w-64"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex h-16 items-center justify-center">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                <ChevronRight className={cn("h-6 w-6 transition-transform", isOpen && "rotate-180")} />
                <span className="sr-only">Alternar barra lateral</span>
              </Button>
            </div>
            <div className="space-y-4 py-4">
              <SidebarItem icon={Sparkles} label="Búsqueda Inteligente" isOpen={isOpen} onClick={toggleIntelligentSearch} />
              <SidebarItem icon={Store} label="Tiendas Favoritas" isOpen={isOpen} />
              <SidebarItem icon={History} label="Historial" isOpen={isOpen} />
              <SidebarItem icon={Settings} label="Configuración" isOpen={isOpen} />
              <SidebarItem icon={HelpCircle} label="Ayuda" isOpen={isOpen} />
            </div>
          </div>
          <div className="space-y-4 py-4">
            <SidebarItem icon={PlusCircle} label="Añadir Carro" isOpen={isOpen} onClick={handleAddCar} />
            <SidebarItem icon={User} label="Perfil" isOpen={isOpen} />
          </div>
        </div>
      </aside>
      <main className={cn("flex-1 transition-all duration-300 ease-in-out relative", isOpen ? "ml-64" : "ml-16")}>
        {!isIntelligentSearch ? (
          <div className="container mx-auto px-4 py-8">
            <div className={cn(
              "transition-all duration-500 ease-in-out",
              isSearching ? "mb-8" : "mb-32"
            )}>
              <h1 className={cn(
                "text-center text-4xl font-bold tracking-tighter transition-all duration-500 ease-in-out sm:text-5xl md:text-6xl",
                isSearching && "text-2xl sm:text-3xl md:text-4xl"
              )}>
                Encuentra las piezas adecuadas para tu coche
              </h1>
              {!isSearching && (
                <p className="mt-4 max-w-[700px] text-center text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mx-auto">
                  Busca en nuestro extenso catálogo de piezas de automóvil para encontrar exactamente lo que necesitas.
                </p>
              )}
            </div>
            <div className="w-full max-w-4xl mx-auto space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
              <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-2xl mx-auto">
                <Search className="absolute left-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full bg-white pl-10 pr-20 py-2 text-base rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                  placeholder={`Buscar ${partNames[placeholderIndex]}...`}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-2 flex items-center space-x-2">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Búsqueda por voz">
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Búsqueda por voz</span>
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Búsqueda por imagen">
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Búsqueda por imagen</span>
                  </Button>
                </div>
              </form>
              <div className="flex items-center justify-center flex-wrap gap-2 mt-4 w-full">
                <Button
                  className="mr-2"
                  variant="outline"
                  size="sm"
                  onClick={toggleIntelligentSearch}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Búsqueda Inteligente
                </Button>
                <Button variant="outline" size="sm" onClick={handleAddCar}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Carro
                </Button>
              </div>
            </div>
            {isSearching && (
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  <h2 className="text-2xl font-bold">Resultados patrocinados</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sponsoredItems.map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <CardTitle>{item.name}</CardTitle>
                          <CardDescription>{item.store}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <img src={item.image} alt={`Tienda ${item.store}`} className="w-full h-24 object-cover mb-4 rounded-md" />
                          <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
                          <div className="flex items-center mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-5 w-5",
                                  i < Math.floor(item.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                )}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold mt-8">Todos los resultados</h2>
                  <div className="space-y-4">
                    {regularItems.map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <CardTitle>{item.name}</CardTitle>
                          <CardDescription>{item.store}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4">
                            <img src={item.image} alt={`Tienda ${item.store}`} className="w-24 h-24 object-cover rounded-md" />
                            <div className="flex-1">
                              <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
                              <div className="flex items-center mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-5 w-5",
                                      i < Math.floor(item.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                    )}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="sticky top-4 self-start">
                  <Card className="h-[calc(100vh-2rem)] flex flex-col">
                    <CardHeader>
                      <CardTitle>Chat con Asistente Virtual</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-grow px-4">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "mb-4 flex",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-lg px-4 py-2 max-w-[80%]",
                              message.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            )}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                    <CardFooter>
                      <form onSubmit={handleChatSubmit} className="flex w-full items-center space-x-2">
                        <Input id="chatInput" placeholder="Escribe tu mensaje..." />
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Paperclip className="h-4 w-4" />
                          <span className="sr-only">Subir archivo</span>
                        </Button>
                        <Button type="button" size="icon" variant="outline" onClick={handleVoiceRecord}>
                          <Volume2 className={cn("h-4 w-4", isRecording && "text-red-500")} />
                          <span className="sr-only">Grabar mensaje de voz</span>
                        </Button>
                        <Button type="submit" size="icon">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Enviar mensaje</span>
                        </Button>
                      </form>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-screen bg-white text-gray-800">
            <div className="flex-1 flex flex-col">
              <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <Sparkles className="h-8 w-8 text-blue-500" />
                  <h1 className="text-2xl font-bold">Búsqueda Inteligente de Piezas</h1>
                </div>
                <Button variant="outline" size="sm" onClick={toggleIntelligentSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Búsqueda Normal
                </Button>
              </header>
              <div className="flex-1 overflow-hidden">
                <div className="h-full flex">
                  <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Historial de Búsqueda</h2>
                    <div className="space-y-2">
                      {chatMessages.map((message, index) => (
                        message.role === "user" && (
                          <div key={index} className="p-2 rounded bg-gray-100 text-sm">
                            {message.content}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "mb-4 flex",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.role === "system" && (
                            <Avatar className="mr-2">
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              "rounded-lg px-4 py-2 max-w-[80%]",
                              message.role === "user"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            )}
                          >
                            {message.content}
                          </div>
                          {message.role === "user" && (
                            <Avatar className="ml-2">
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
                        <Input 
                          id="chatInput" 
                          placeholder="Describe la pieza que necesitas..." 
                          className="flex-grow bg-white border-gray-300 focus:border-blue-500"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                        <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon className="h-4 w-4" />
                          <span className="sr-only">Subir imagen</span>
                        </Button>
                        <Button type="button" size="icon" variant="outline" onClick={handleVoiceRecord}>
                          <Volume2 className={cn("h-4 w-4", isRecording && "text-red-500")} />
                          <span className="sr-only">Grabar mensaje de voz</span>
                        </Button>
                        <Button type="submit" size="icon">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Enviar mensaje</span>
                        </Button>
                      </form>
                      {!userCar && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2" 
                          onClick={handleAddUserCar}
                        >
                          <Car className="mr-2 h-4 w-4" />
                          Añadir mi carro
                        </Button>
                      )}
                      {userCar && (
                        <div className="mt-2 text-sm text-gray-600">
                          Carro actual: {userCar.brand} {userCar.model} {userCar.year}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-1/4 border-l border-gray-200 p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Sugerencias de Piezas</h2>
                    <div className="space-y-4">
                      {sponsoredItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center mb-2">
                            <img src={item.image} alt={`Tienda ${item.store}`} className="w-12 h-12 object-cover rounded-md mr-3" />
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.store}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img src={`/placeholder.svg?height=20&width=20&text=${item.brand}`} alt={item.brand} className="w-5 h-5 mr-1" />
                              <span className="text-xs text-gray-500">{item.brand}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-xs text-gray-500">{item.storeReputation.toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            A {item.distance.toFixed(1)} km de distancia
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function SidebarItem({ icon: Icon, label, isOpen, onClick }: { icon: React.ElementType; label: string; isOpen: boolean; onClick?: () => void }) {
  return (
    <div className="px-2">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          isOpen ? "px-4" : "px-2"
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5" />
        {isOpen && <span className="ml-2">{label}</span>}
      </Button>
    </div>
  )
}