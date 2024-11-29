"use client"

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import toast, { Toaster } from 'react-hot-toast'

export default function EventCreationForm() {
  const [eventName, setEventName] = useState("")
  const [eventChannel, setEventChannel] = useState("")
  const [eventDate, setEventDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Formatear la fecha a 'YYYY-MM-DD'
      const formattedDate = eventDate ? format(eventDate, "yyyy-MM-dd") : ""

      // Hacer la petición HTTP con el formato adecuado
      const response = await fetch('http://127.0.0.1:5000/CrearEvento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: eventName,
          canal: eventChannel,
          fecha: formattedDate,
        }),
      })

      if (response.ok) {
        toast.success('Evento creado correctamente', {
          style: {
            background: '#10B981',
            color: '#fff',
          },
        })
        // Reiniciar el formulario
        setEventName("")
        setEventChannel("")
        setEventDate("")
      } else {
        throw new Error('Error al crear el evento')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al crear el evento', {
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear Nuevo Evento</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Nombre del Evento</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventChannel">Canal del Evento</Label>
              <Select value={eventChannel} onValueChange={setEventChannel} required>
                <SelectTrigger id="eventChannel">
                  <SelectValue placeholder="Selecciona un canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="FACEBOOK">Facebook</SelectItem>
                  <SelectItem value="X">X</SelectItem>
                  <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                  <SelectItem value="YOUTUBE">YouTube</SelectItem> {/* Agregado YouTube */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Fecha del Evento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!eventDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Evento'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster position="bottom-center" />
    </>
  )
}
