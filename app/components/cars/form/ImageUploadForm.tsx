import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Upload, X, Star, MoveUp, MoveDown } from "lucide-react"

export interface ImagePreview {
  file: File
  preview: string
  isMain: boolean
  id: string
}

interface ImageUploadFormProps {
  images: ImagePreview[]
  onImagesChange: (images: ImagePreview[]) => void
}

export function ImageUploadForm({ images, onImagesChange }: ImageUploadFormProps) {
  const generateImageId = useCallback(() => Math.random().toString(36).substr(2, 9), [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: ImagePreview[] = acceptedFiles.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isMain: images.length === 0 && index === 0, // First image of first upload is main
      id: generateImageId()
    }))
    
    const updatedImages = [...images, ...newImages]
    
    // Ensure we always have exactly one main image
    const hasMain = updatedImages.some(img => img.isMain)
    if (!hasMain && updatedImages.length > 0) {
      updatedImages[0].isMain = true
    }
    
    onImagesChange(updatedImages)
  }, [images, onImagesChange, generateImageId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 20,
    multiple: true
  })

  const removeImage = useCallback((id: string) => {
    const filtered = images.filter(img => img.id !== id)
    // If we removed the main image, make the first remaining image main
    if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
      filtered[0].isMain = true
    }
    onImagesChange(filtered)
  }, [images, onImagesChange])

  const setMainImage = useCallback((id: string) => {
    const updated = images.map(img => ({
      ...img,
      isMain: img.id === id
    }))
    onImagesChange(updated)
  }, [images, onImagesChange])

  const moveImageUp = useCallback((id: string) => {
    const index = images.findIndex(img => img.id === id)
    if (index > 0) {
      const newArray = [...images]
      const [removed] = newArray.splice(index, 1)
      newArray.splice(index - 1, 0, removed)
      onImagesChange(newArray)
    }
  }, [images, onImagesChange])

  const moveImageDown = useCallback((id: string) => {
    const index = images.findIndex(img => img.id === id)
    if (index < images.length - 1) {
      const newArray = [...images]
      const [removed] = newArray.splice(index, 1)
      newArray.splice(index + 1, 0, removed)
      onImagesChange(newArray)
    }
  }, [images, onImagesChange])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-4">
        <h3 className="text-base md:text-lg font-medium">Foto's uploaden</h3>
        
        {/* Drop zone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-md p-6 md:p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-muted/50'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4" />
          <p className="text-base md:text-lg font-medium mb-2">
            {isDragActive ? 'Sleep de foto\'s hierheen...' : 'Sleep foto\'s hierheen of klik om te bladeren'}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">
            Maximaal 20 foto's (JPEG, PNG, WebP)
          </p>
          <p className="text-xs text-muted-foreground">
            De eerste foto wordt automatisch als hoofdfoto ingesteld
          </p>
        </div>
        
        {/* Image previews with management options */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm md:text-md font-medium">{images.length} foto(s) geselecteerd</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="hidden sm:inline">Sleep om de volgorde te wijzigen, klik op de ster om de hoofdfoto te selecteren</span>
                <span className="sm:hidden">Klik op ster voor hoofdfoto</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {images.map((imagePreview, index) => (
                <div key={imagePreview.id} className="group relative">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={imagePreview.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Image controls overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7"
                        onClick={() => setMainImage(imagePreview.id)}
                        title="Instellen als hoofdfoto"
                      >
                        <Star className={`h-3 w-3 ${imagePreview.isMain ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7"
                        onClick={() => removeImage(imagePreview.id)}
                        title="Verwijderen"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex gap-1">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-6 w-6 sm:h-7 sm:w-7"
                          onClick={() => moveImageUp(imagePreview.id)}
                          title="Naar boven verplaatsen"
                        >
                          <MoveUp className="h-3 w-3" />
                        </Button>
                      )}
                      {index < images.length - 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="h-6 w-6 sm:h-7 sm:w-7"
                          onClick={() => moveImageDown(imagePreview.id)}
                          title="Naar beneden verplaatsen"
                        >
                          <MoveDown className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Main image badge */}
                  {imagePreview.isMain && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-yellow-400 text-yellow-900 text-xs"
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      <span className="hidden sm:inline">Hoofdfoto</span>
                      <span className="sm:hidden">Main</span>
                    </Badge>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1 sm:mt-2 truncate">
                    {imagePreview.file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
