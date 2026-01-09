import { useEffect, useState } from 'react';
import './ImageSlider.css';

interface ImageSliderProps {
  imageFolder?: string;
  fallbackGradient?: string;
  opacity?: number;
  transitionDuration?: number;
}

/**
 * Image slider component that displays a rotating carousel of background images.
 * Falls back to a gradient if no images are found.
 * 
 * @param imageFolder - Path to folder containing images (relative to public)
 * @param fallbackGradient - CSS gradient string for fallback background
 * @param opacity - Opacity of images (0-1)
 * @param transitionDuration - Duration between image transitions in ms
 */
export function ImageSlider({
  imageFolder = '/images/hero',
  fallbackGradient = 'linear-gradient(135deg, #FFFBF8 0%, #FFE8E0 50%, #FFF4E6 100%)',
  opacity = 0.3,
  transitionDuration = 5000,
}: ImageSliderProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Try to load images from the specified folder
    // In production, this would ideally be configured via environment variables
    // For now, we'll use a common pattern: images named hero-1.jpg, hero-2.jpg, etc.
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const potentialImages: string[] = [];

    // Try common naming patterns (hero-1, hero-2, etc. or numbered)
    for (let i = 1; i <= 10; i++) {
      imageExtensions.forEach((ext) => {
        potentialImages.push(`${imageFolder}/hero-${i}${ext}`);
        potentialImages.push(`${imageFolder}/${i}${ext}`);
        potentialImages.push(`${imageFolder}/image-${i}${ext}`);
      });
    }

    // Test which images actually exist
    const checkImages = async () => {
      const validImages: string[] = [];
      const checkPromises: Promise<void>[] = [];
      
      for (const imgPath of potentialImages) {
        const checkPromise = new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            validImages.push(imgPath);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = imgPath;
        });
        checkPromises.push(checkPromise);
      }

      await Promise.all(checkPromises);

      if (validImages.length > 0) {
        setImages(validImages);
      }
    };

    checkImages();
  }, [imageFolder]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, transitionDuration);

    return () => clearInterval(interval);
  }, [images.length, transitionDuration]);

  // If no images, use fallback gradient
  if (images.length === 0) {
    return (
      <div
        className="image-slider fallback"
        style={{ background: fallbackGradient }}
      />
    );
  }

  return (
    <div className="image-slider">
      {images.map((img, index) => (
        <div
          key={img}
          className={`slider-image ${index === currentIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === currentIndex ? opacity : 0,
          }}
        />
      ))}
      {/* Overlay for additional opacity control */}
      <div className="slider-overlay" style={{ opacity: 1 - opacity }} />
    </div>
  );
}
