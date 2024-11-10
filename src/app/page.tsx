"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { 
  ChevronRight, ChevronDown, Search, Sparkles, History, User, Mic, Camera, Store, PlusCircle, Star, Send, Paperclip, Volume2, X, Image as ImageIcon, Settings, HelpCircle, Car, MapPin, LogIn 
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductItem {
  id: number;
  name: string;
  price: number;
  rating: number;
  store: string;
  image: string;
  brand: string;
  description: string;
  category: string;
  isOriginal: boolean;
  storeReputation?: number;
  distance?: number;
}

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

const sponsoredItems: ProductItem[] = [
  {
    id: 1,
    name: "Pastillas de freno premium",
    price: 49.99,
    rating: 4.5,
    store: "AutoParts Plus",
    image: "https://via.placeholder.com/200x100?text=AutoParts+Plus",
    brand: "Brembo",
    description: "Pastillas de freno de alta calidad con compuesto cerámico. Ofrece mayor durabilidad, menor generación de polvo y funcionamiento silencioso. Ideal para vehículos de alto rendimiento.",
    category: "Sistema de Frenos",
    isOriginal: false,
    storeReputation: 4.8,
    distance: 2.5
  },
  {
    id: 2,
    name: "Filtro de aceite de alto rendimiento",
    price: 12.99,
    rating: 4.8,
    store: "MechanicsMaster",
    image: "https://via.placeholder.com/200x100?text=MechanicsMaster",
    brand: "K&N",
    description: "Filtro de aceite premium con capacidad de filtración superior. Diseñado para una máxima protección del motor y intervalos de cambio extendidos.",
    category: "Filtración",
    isOriginal: false,
    storeReputation: 4.6,
    distance: 3.7
  },
  {
    id: 3,
    name: "Bujías de iridio",
    price: 8.99,
    rating: 4.7,
    store: "SparkPlugPro",
    image: "https://via.placeholder.com/200x100?text=SparkPlugPro",
    brand: "NGK",
    description: "Bujías de iridio de larga duración. Proporcionan un encendido óptimo, mejor consumo de combustible y rendimiento superior del motor.",
    category: "Encendido",
    isOriginal: true,
    storeReputation: 4.9,
    distance: 1.8
  },
]

const regularItems: ProductItem[] = [
  {
    id: 4,
    name: "Amortiguadores deportivos",
    price: 89.99,
    rating: 4.3,
    store: "SuspensionKing",
    image: "https://via.placeholder.com/200x100?text=SuspensionKing",
    brand: "Monroe",
    description: "Amortiguadores de alto rendimiento diseñados para una conducción deportiva. Mejora la estabilidad y el control en curvas.",
    category: "Suspensión",
    isOriginal: false
  },
  // Add similar detailed information for other regular items...
]

interface ChatMessage {
  role: "user" | "system";
  content: string;
}

interface N8NResponse {
  message: string;
  data?: any;
}

interface FilterOptions {
  precioMin: number;
  precioMax: number;
  categoria: string[];
  marca: string[];
  condicion: "todos" | "original" | "aftermarket";
  ordenar: "relevancia" | "precioAsc" | "precioDesc" | "calificacion";
}

function FiltrosBusqueda({ onFilterChange }: { onFilterChange: (filters: FilterOptions) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    precioMin: 0,
    precioMax: 1000,
    categoria: [],
    marca: [],
    condicion: "todos",
    ordenar: "relevancia"
  });

  const categorias = [
    "Sistema de Frenos",
    "Filtración",
    "Encendido",
    "Suspensión",
    "Motor",
    "Transmisión",
    "Eléctrico",
    "Dirección",
    "Refrigeración"
  ];

  const marcas = [
    "Brembo",
    "Bosch",
    "NGK",
    "Monroe",
    "Gates",
    "ACDelco",
    "MANN",
    "Sachs",
    "Valeo",
    "Denso"
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#2E4053]/10">
      <div className="p-4 border-b border-[#2E4053]/10">
        <h3 className="text-lg font-medium text-[#2E4053]">Filtros</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Ordenar por */}
        <div>
          <label className="text-sm font-medium text-[#2E4053]">Ordenar por</label>
          <select 
            className="mt-2 w-full h-9 bg-white border border-[#2E4053]/20 rounded-md text-sm focus:ring-2 focus:ring-[#2E4053] focus:border-transparent"
            value={filters.ordenar}
            onChange={(e) => setFilters({...filters, ordenar: e.target.value as any})}
          >
            <option value="relevancia">Relevancia</option>
            <option value="precioAsc">Precio: Menor a Mayor</option>
            <option value="precioDesc">Precio: Mayor a Menor</option>
            <option value="calificacion">Mejor Calificados</option>
          </select>
        </div>

        {/* Rango de Precio */}
        <div>
          <label className="text-sm font-medium text-[#2E4053]">Rango de Precio</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2E4053]/60">$</span>
                <Input
                  type="number"
                  placeholder="Min"
                  className="pl-7 h-9"
                  value={filters.precioMin}
                  onChange={(e) => setFilters({...filters, precioMin: Number(e.target.value)})}
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2E4053]/60">$</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="pl-7 h-9"
                  value={filters.precioMax}
                  onChange={(e) => setFilters({...filters, precioMax: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Condición */}
        <div>
          <label className="text-sm font-medium text-[#2E4053]">Condición</label>
          <div className="mt-2 space-y-2">
            {["Todos", "Original", "Aftermarket"].map((condition) => (
              <label key={condition} className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value={condition.toLowerCase()}
                  checked={filters.condicion === condition.toLowerCase()}
                  onChange={(e) => setFilters({...filters, condicion: e.target.value as any})}
                  className="w-4 h-4 text-[#F1C40F] border-[#2E4053]/20 focus:ring-[#F1C40F]"
                />
                <span className="ml-2 text-sm text-[#2E4053]/80">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categorías */}
        <div>
          <label className="text-sm font-medium text-[#2E4053]">Categorías</label>
          <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
            {categorias.map((cat) => (
              <label key={cat} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categoria.includes(cat)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...filters.categoria, cat]
                      : filters.categoria.filter(c => c !== cat);
                    setFilters({...filters, categoria: newCategories});
                  }}
                  className="w-4 h-4 rounded text-[#F1C40F] border-[#2E4053]/20 focus:ring-[#F1C40F]"
                />
                <span className="ml-2 text-sm text-[#2E4053]/80">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Marcas */}
        <div>
          <label className="text-sm font-medium text-[#2E4053]">Marcas</label>
          <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
            {marcas.map((marca) => (
              <label key={marca} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.marca.includes(marca)}
                  onChange={(e) => {
                    const newMarcas = e.target.checked
                      ? [...filters.marca, marca]
                      : filters.marca.filter(m => m !== marca);
                    setFilters({...filters, marca: newMarcas});
                  }}
                  className="w-4 h-4 rounded text-[#F1C40F] border-[#2E4053]/20 focus:ring-[#F1C40F]"
                />
                <span className="ml-2 text-sm text-[#2E4053]/80">{marca}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-[#2E4053]/5 border-t border-[#2E4053]/10">
        <Button 
          onClick={() => onFilterChange(filters)}
          className="w-full bg-[#2E4053] hover:bg-[#2E4053]/90 text-white border border-[#F1C40F]/20 hover:border-[#F1C40F]/40"
        >
          Aplicar Filtros
        </Button>
        <Button 
          onClick={() => {
            setFilters({
              precioMin: 0,
              precioMax: 1000,
              categoria: [],
              marca: [],
              condicion: "todos",
              ordenar: "relevancia"
            });
          }}
          variant="outline" 
          className="w-full mt-2 border-[#2E4053]/20 hover:bg-[#2E4053]/5 text-[#2E4053]"
        >
          Limpiar Filtros
        </Button>
      </div>
    </div>
  );
}

interface CarFormData {
  brand: string;
  model: string;
  year: string;
  version?: string;
  engine?: string;
}

interface CarMake {
  name: string;
  models: {
    name: string;
    years: number[];
    versions?: string[];
    engines?: string[];
  }[];
}

const carMakes: CarMake[] = [
  {
    name: "Toyota",
    models: [
      {
        name: "Corolla",
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        versions: ["LE", "XLE", "SE", "XSE"],
        engines: ["1.8L 4-cil", "2.0L 4-cil"]
      },
      {
        name: "Camry",
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        versions: ["LE", "SE", "XLE", "XSE", "TRD"],
        engines: ["2.5L 4-cil", "3.5L V6"]
      },
      {
        name: "RAV4",
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        versions: ["LE", "XLE", "Adventure", "Limited"],
        engines: ["2.5L 4-cil", "2.5L Híbrido"]
      }
    ]
  },
  {
    name: "Honda",
    models: [
      {
        name: "Civic",
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        versions: ["LX", "Sport", "EX", "Touring"],
        engines: ["1.5L Turbo", "2.0L 4-cil"]
      },
      {
        name: "Accord",
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        versions: ["LX", "Sport", "EX-L", "Touring"],
        engines: ["1.5L Turbo", "2.0L Turbo", "2.0L Híbrido"]
      }
    ]
  },
  {
    name: "Nissan",
    models: [
      {
        name: "Sentra",
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        versions: ["S", "SV", "SR"],
        engines: ["2.0L 4-cil"]
      },
      {
        name: "Altima",
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        versions: ["S", "SV", "SR", "SL"],
        engines: ["2.5L 4-cil", "2.0L VC-Turbo"]
      }
    ]
  }
];

function AddCarDialog({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: CarFormData) => void; 
}) {
  const [formData, setFormData] = useState<CarFormData>({
    brand: '',
    model: '',
    year: '',
    version: '',
    engine: ''
  });

  const selectedMake = carMakes.find(make => make.name === formData.brand);
  const selectedModel = selectedMake?.models.find(model => model.name === formData.model);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#2E4053] text-xl font-semibold">
            Añadir Vehículo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2E4053]">
              Marca*
            </label>
            <select
              required
              value={formData.brand}
              onChange={(e) => {
                setFormData({ 
                  brand: e.target.value,
                  model: '',
                  year: '',
                  version: '',
                  engine: ''
                });
              }}
              className="w-full h-9 bg-white border border-[#2E4053]/20 rounded-md text-sm focus:ring-2 focus:ring-[#2E4053] focus:border-transparent"
            >
              <option value="">Seleccionar marca</option>
              {carMakes.map((make) => (
                <option key={make.name} value={make.name}>
                  {make.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2E4053]">
              Modelo*
            </label>
            <select
              required
              value={formData.model}
              onChange={(e) => {
                setFormData({ 
                  ...formData,
                  model: e.target.value,
                  year: '',
                  version: '',
                  engine: ''
                });
              }}
              disabled={!formData.brand}
              className="w-full h-9 bg-white border border-[#2E4053]/20 rounded-md text-sm focus:ring-2 focus:ring-[#2E4053] focus:border-transparent disabled:opacity-50"
            >
              <option value="">Seleccionar modelo</option>
              {selectedMake?.models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2E4053]">
              Año*
            </label>
            <select
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              disabled={!formData.model}
              className="w-full h-9 bg-white border border-[#2E4053]/20 rounded-md text-sm focus:ring-2 focus:ring-[#2E4053] focus:border-transparent disabled:opacity-50"
            >
              <option value="">Seleccionar año</option>
              {selectedModel?.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2E4053]">
              Versión
            </label>
            <select
              value={formData.version || ''}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              disabled={!formData.year}
              className="w-full h-9 bg-white border border-[#2E4053]/20 rounded-md text-sm focus:ring-2 focus:ring-[#2E4053] focus:border-transparent disabled:opacity-50"
            >
              <option value="">Seleccionar versión</option>
              {selectedModel?.versions?.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2E4053]">
              Motor
            </label>
            <select
              value={formData.engine || ''}
              onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
              disabled={!formData.year}
              className="w-full h-9 bg-white border border-[#2E4053]/20 rounded-md text-sm focus:ring-2 focus:ring-[#2E4053] focus:border-transparent disabled:opacity-50"
            >
              <option value="">Seleccionar motor</option>
              {selectedModel?.engines?.map((engine) => (
                <option key={engine} value={engine}>
                  {engine}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-[#2E4053] hover:bg-[#2E4053]/90 text-white border border-[#F1C40F]/20 hover:border-[#F1C40F]/40"
            >
              Guardar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#2E4053]/20 hover:bg-[#2E4053]/5 text-[#2E4053]"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "system", content: "Hola, soy tu asistente virtual de búsqueda de piezas de automóvil. ¿En qué puedo ayudarte hoy?" }
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isIntelligentSearch, setIsIntelligentSearch] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [userCar, setUserCar] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);

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
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: "system", content: `Aquí tienes los resultados para "${searchQuery}". ¿Necesitas más información sobre algún producto en particular?` }])
    }, 1000)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("chatInput") as HTMLInputElement;
    const userMessage = input.value.trim();
    
    if (userMessage) {
      setIsLoading(true);
      setError(null);
      
      // Add user message to chat immediately
      setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
      input.value = "";
  
      try {
        const payload = {
          type: "chat",
          data: {
            message: userMessage,
            metadata: {
              userCar: userCar ? {
                brand: userCar.brand,
                model: userCar.model,
                year: userCar.year
              } : null,
              timestamp: new Date().toISOString(),
              source: "partes-app-bot",
              sessionId: localStorage.getItem('chatSessionId') || Math.random().toString(36).substring(7),
              userLanguage: navigator.language,
              clientInfo: {
                userAgent: navigator.userAgent,
                platform: navigator.platform
              }
            }
          }
        };
  
        const response = await fetch('/api/n8nconnect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
  
        const result: N8NResponse = await response.json();
        console.log('N8N Response:', result); // Debug log

        // Check if the response contains search results
        const hasSearchResults = result.data?.searchResults || result.data?.products;
        setShowSuggestions(hasSearchResults);

        // Get the message from the response
        const messageContent = result.data?.text || result.message || 'Lo siento, no pude procesar tu mensaje correctamente.';
        
        // Add the AI response to chat
        setChatMessages(prev => [...prev, { 
          role: "system", 
          content: messageContent
        }]);

      } catch (err) {
        console.error('Error en el chat:', err);
        setError(err instanceof Error ? err.message : 'Error al procesar la solicitud');
        
        setChatMessages(prev => [...prev, { 
          role: "system", 
          content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde."
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setChatMessages(prev => [...prev, { role: "user", content: `Archivo subido: ${file.name}` }])
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: "system", content: `He recibido tu archivo "${file.name}". ¿Qué te gustaría que haga con él?` }])
      }, 1000)
    }
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      console.log("Started recording")
    } else {
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
    setIsCarDialogOpen(true);
  };

  const handleCarSubmit = (data: CarFormData) => {
    setUserCar({
      brand: data.brand,
      model: data.model,
      year: data.year,
      version: data.version,
      engine: data.engine
    });
    
    setChatMessages(prev => [
      ...prev,
      { 
        role: "system", 
        content: `He añadido tu ${data.brand} ${data.model} ${data.year} a tu perfil. Ahora puedo ayudarte a encontrar piezas específicas para tu vehículo.` 
      }
    ]);
  };

  const handleSignInClick = () => {
    setIsLoggedIn(true)
    alert("Has iniciado sesión correctamente.")
  }

  const handleProfileClick = () => {
    alert("Navegando al perfil del usuario...")
  }

  useEffect(() => {
    // Initialize chat session ID if not exists
    if (!localStorage.getItem('chatSessionId')) {
      localStorage.setItem('chatSessionId', Math.random().toString(36).substring(7));
    }
  }, []);

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
            <SidebarItem 
              icon={isLoggedIn ? User : LogIn} 
              label={isLoggedIn ? "Perfil" : "Iniciar Sesión"} 
              isOpen={isOpen} 
              onClick={isLoggedIn ? handleProfileClick : handleSignInClick} 
            />
          </div>
        </div>
      </aside>
      <main className={cn("flex-1 transition-all duration-300 ease-in-out relative", isOpen ? "ml-64" : "ml-16")}>
        {!isIntelligentSearch ? (
          <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-4xl mx-auto space-y-4 flex flex-col items-center justify-center">
              <h1 className={cn(
                "text-center text-4xl font-bold tracking-tighter transition-all duration-500 ease-in-out sm:text-5xl md:text-6xl",
                "bg-gradient-to-r from-[#2E4053] to-[#F1C40F] text-transparent bg-clip-text",
                "mb-8",
                isSearching && "text-2xl sm:text-3xl md:text-4xl"
              )}>
                Partes APP
              </h1>
              <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-2xl mx-auto">
                <Search className="absolute left-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full bg-white pl-10 pr-20 py-2 text-base rounded-full border border-[#2E4053]/20 focus:outline-none focus:ring-2 focus:ring-[#2E4053] focus:border-transparent dark:bg-gray-800 dark:border-[#2E4053]/30"
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
                  className="mr-2 border-[#2E4053] text-[#2E4053] hover:bg-[#2E4053]/5"
                  variant="outline"
                  size="sm"
                  onClick={toggleIntelligentSearch}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-[#F1C40F]" />
                  Búsqueda Inteligente
                </Button>
                <Button variant="outline" size="sm" onClick={handleAddCar}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Carro
                </Button>
              </div>
            </div>
            {isSearching && (
              <div className="mt-16 flex gap-6 w-full">
                {/* Filtros - Side Panel */}
                <div className="w-64 flex-shrink-0">
                  <div className="sticky top-4">
                    <FiltrosBusqueda onFilterChange={(filters) => console.log(filters)} />
                  </div>
                </div>
                
                {/* Results Section */}
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#2E4053]">Resultados patrocinados</h2>
                    <p className="text-sm text-[#2E4053]/60">Mostrando {sponsoredItems.length} resultados</p>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sponsoredItems.map((item) => (
                      <Card key={item.id} className="flex flex-col h-full border-[#2E4053]/10 hover:border-[#F1C40F]/30 transition-colors">
                        <CardHeader className="border-b border-[#2E4053]/10">
                          <CardTitle className="text-xl text-[#2E4053]">{item.name}</CardTitle>
                          <CardDescription className="mt-1 text-[#2E4053]/60">{item.store}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <img 
                            src={item.image} 
                            alt={`${item.brand} - ${item.name}`} 
                            className="w-full h-32 object-cover mb-4 rounded-md"
                          />
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="font-semibold text-gray-700">{item.brand}</span>
                                <span className={cn(
                                  "ml-2 px-2 py-0.5 text-xs rounded",
                                  item.isOriginal 
                                    ? "bg-[#F1C40F]/10 text-[#F1C40F] border border-[#F1C40F]/30" 
                                    : "bg-[#2E4053]/10 text-[#2E4053] border border-[#2E4053]/30"
                                )}>
                                  {item.isOriginal ? "Original" : "Aftermarket"}
                                </span>
                              </div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < Math.floor(item.rating) ? "text-[#F1C40F] fill-current" : "text-[#2E4053]/20"
                                    )}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-2xl font-bold text-[#2E4053]">${item.price.toFixed(2)}</p>
                              <Button 
                                className="bg-[#2E4053] hover:bg-[#2E4053]/90 text-white border border-[#F1C40F]/20 hover:border-[#F1C40F]/40"
                              >
                                Comprar Ahora
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Todos los resultados</h2>
                    <p className="text-sm text-[#2E4053]/60">Mostrando {regularItems.length} resultados</p>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {regularItems.map((item) => (
                      <Card key={item.id} className="flex flex-col h-full border-[#2E4053]/10 hover:border-[#F1C40F]/30 transition-colors">
                        <CardHeader className="border-b border-[#2E4053]/10">
                          <CardTitle className="text-xl text-[#2E4053]">{item.name}</CardTitle>
                          <CardDescription className="mt-1 text-[#2E4053]/60">{item.store}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <img 
                            src={item.image} 
                            alt={`${item.brand} - ${item.name}`} 
                            className="w-full h-32 object-cover mb-4 rounded-md"
                          />
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="font-semibold text-[#2E4053]">{item.brand}</span>
                                <span className={cn(
                                  "ml-2 px-2 py-0.5 text-xs rounded",
                                  item.isOriginal 
                                    ? "bg-[#F1C40F]/10 text-[#F1C40F] border border-[#F1C40F]/30" 
                                    : "bg-[#2E4053]/10 text-[#2E4053] border border-[#2E4053]/30"
                                )}>
                                  {item.isOriginal ? "Original" : "Aftermarket"}
                                </span>
                              </div>
                              <div className="px-2 py-1 bg-[#2E4053]/10 text-[#2E4053] text-xs font-semibold rounded">
                                {item.category}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-4 w-4",
                                    i < Math.floor(item.rating) ? "text-[#F1C40F] fill-current" : "text-[#2E4053]/20"
                                  )}
                                />
                              ))}
                              <span className="ml-2 text-sm text-[#2E4053]/60">{item.rating.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-[#2E4053]/70 line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-2xl font-bold text-[#2E4053]">${item.price.toFixed(2)}</p>
                              <Button 
                                className="bg-[#2E4053] hover:bg-[#2E4053]/90 text-white border border-[#F1C40F]/20 hover:border-[#F1C40F]/40"
                              >
                                Comprar Ahora
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                {isLoading && (
                  <div className="flex items-center text-blue-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
                    Procesando...
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={toggleIntelligentSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Búsqueda Normal
                </Button>
              </header>
              <div className="flex-1 overflow-hidden">
                <div className="h-full flex">
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
                              <AvatarImage src="https://via.placeholder.com/40" alt="AI Assistant" />
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
                              <AvatarImage src="https://via.placeholder.com/40" alt="User" />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="mb-4 flex justify-start">
                          <div className="rounded-lg px-4 py-2 max-w-[80%] bg-gray-100 text-gray-800 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2" />
                            Procesando...
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
                        <Input 
                          id="chatInput" 
                          placeholder={isLoading ? "Procesando..." : "Escribe tu mensaje..."}
                          disabled={isLoading}
                          className={cn(
                            "flex-grow",
                            isLoading && "opacity-50"
                          )}
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*"
                          disabled={isLoading}
                        />
                        <Button 
                          type="button" 
                          size="icon" 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span className="sr-only">Subir imagen</span>
                        </Button>
                        <Button 
                          type="button" 
                          size="icon" 
                          variant="outline" 
                          onClick={handleVoiceRecord}
                          disabled={isLoading}
                        >
                          <Volume2 className={cn("h-4 w-4", isRecording && "text-red-500")} />
                          <span className="sr-only">Grabar mensaje de voz</span>
                        </Button>
                        <Button type="submit" size="icon" disabled={isLoading}>
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </form>
                      {error && (
                        <div className="mt-2 text-sm text-red-500">
                          {error}
                        </div>
                      )}
                      {!userCar && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2" 
                          onClick={handleAddCar}
                          disabled={isLoading}
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
                  <div
                    className={cn(
                      "border-l border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out",
                      showSuggestions ? "w-1/4 opacity-100" : "w-0 opacity-0"
                    )}
                  >
                    <div className="p-4 w-80">
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
                                <img src={`https://via.placeholder.com/20x20?text=${item.brand}`} alt={item.brand} className="w-5 h-5 mr-1" />
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
          </div>
        )}
      </main>
      <AddCarDialog
        isOpen={isCarDialogOpen}
        onClose={() => setIsCarDialogOpen(false)}
        onSubmit={handleCarSubmit}
      />
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
