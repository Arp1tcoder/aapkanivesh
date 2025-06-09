import os
import requests
from PIL import Image
from io import BytesIO

def create_placeholder_image(width, height, text, filename):
    """Create a placeholder image with the given dimensions and text"""
    img = Image.new('RGB', (width, height), color='#f0f0f0')
    from PIL import ImageDraw, ImageFont
    draw = ImageDraw.Draw(img)
    
    # Try to use a system font, fall back to default if not available
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    # Draw text in the center
    text_width = draw.textlength(text, font=font)
    text_height = 40
    position = ((width - text_width) // 2, (height - text_height) // 2)
    draw.text(position, text, fill='#666666', font=font)
    
    # Save the image
    img.save(filename)

def main():
    # Create images directory if it doesn't exist
    if not os.path.exists('images'):
        os.makedirs('images')
    
    # Create slideshow images
    for i in range(1, 4):
        create_placeholder_image(1200, 600, f'Slide {i}', f'images/slide{i}.jpg')
    
    # Create gallery images
    for i in range(1, 17):
        create_placeholder_image(400, 300, f'Gallery {i}', f'images/gallery{i}.jpg')
    
    # Create founder image
    create_placeholder_image(400, 500, 'Founder Photo', 'images/founder.jpg')
    
    # Create mutual funds concept image
    create_placeholder_image(800, 400, 'Mutual Funds Concept', 'images/mutual-funds-concept.jpg')
    
    print("All placeholder images have been created successfully!")

if __name__ == "__main__":
    main() 