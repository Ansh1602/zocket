import React, { useEffect, useRef, useState } from 'react'
import { SketchPicker } from "react-color";
import qq from './qq.jpeg';
const MASK = 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png?random=12345';
const STROKE = 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png';
const DESIGN = 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png';



const Ad = () => {
  const [image, setImage] = useState(qq);
  const [captionT, setCaptionT] = useState('1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs')
  const [ctaT, setCtaT] = useState('Shop Now')
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const captionRef = useRef(null);
  const ctaRef = useRef(null);

  const [showPicker, setShowPicker] = useState(false);
  const [lastPickedColors, setLastPickedColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#0369A1'); // Initial color
  const pickerRef = useRef(null);

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };


  const handleOutsideClick = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      // Clicked outside the color picker popover
      if (selectedColor !== '#ffffff') {
        // If a color has been selected, add it to the list
        setLastPickedColors((prevColors) => {
          const updatedColors = [selectedColor, ...prevColors.slice(0, 4)];
          return updatedColors;
        });
      }
      setShowPicker(false);
    }
  };

  const handlePreviousColorClick = (color) => {
    setSelectedColor(color);
    setShowPicker(false); // Close the color picker popover
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    const url = URL.createObjectURL(file);
    setImage(url);
    console.log(url);
  }

  const handleButtonClick = (e) => {
    if(captionRef.current.value){
      setCaptionT(captionRef.current.value);
      captionRef.current.value = ""
    }

    if(ctaRef.current.value){
      setCtaT(ctaRef.current.value);
      ctaRef.current.value = "";
    }
    // console.log(caption);
  }

  useEffect(() => {

    

    // Add event listener for clicks outside the color picker popover
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      // Cleanup
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [selectedColor,]); // Re-run effect when selectedColor changes

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = selectedColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    ctx.globalCompositeOperation = 'source-over';

    const design = new Image();
    design.src = DESIGN;
    design.onload = () => {
      ctx.drawImage(design, 0, 0, canvas.width, canvas.height);
    }



    // Load mask image(white box)
    const maskImage = new Image();
    const userImage = new Image();
    userImage.src = image;
    maskImage.src = MASK;
    maskImage.onload = () => {
      tempCtx.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
      tempCtx.globalCompositeOperation = 'source-in';

      tempCtx.drawImage(userImage, 0, 0, canvas.width, canvas.height);
      userImage.onload = () => {
        console.log('Hellll');
      };
      ctx.drawImage(tempCanvas, 0, 0);
    }

    const stroke = new Image();
    stroke.src = STROKE;
    stroke.onload = () => {
      ctx.drawImage(stroke, 0, 0, canvas.width, canvas.height);
    }

    // For the main caption text
    function drawCaption(ctx) {
      const caption = {
        text: captionT,
        position: { x: 100, y: 50 },
        maxCharactersPerLine: 31,
        fontSize: 47,
        alignment: "left",
        textColor: "#FFFFFF"
      };

      const { text, position, fontSize, alignment, textColor, maxCharactersPerLine } = caption;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = textColor;
      ctx.textAlign = alignment;

      const lines = breakTextIntoLines(text, maxCharactersPerLine);
      lines.forEach((line, index) => {
        const yPos = position.y + (index + 1) * fontSize;
        ctx.fillText(line, position.x, yPos);
      });
    }

    // For breaking text into lines based on maximum characters per line
    function breakTextIntoLines(text, maxCharactersPerLine) {
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";
      words.forEach((word) => {
        if (currentLine.length + word.length <= maxCharactersPerLine) {
          currentLine += (currentLine.length > 0 ? " " : "") + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      return lines;
    }

    function drawCTA(ctx) {
      const cta = {
        text: ctaT,
        position: { x: 100, y: 200 },
        textColor: "#FFFFFF",
        backgroundColor: "#000000"
      };

      const { text, position, fontSize = 40, textColor, backgroundColor, padding = 30 } = cta;

      // Measure text width
      ctx.font = `${fontSize}px Arial`;
      const textWidth = ctx.measureText(text).width;

      // Draw rounded rectangle
      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.roundRect(position.x, position.y, textWidth + 2 * padding, fontSize + 2 * padding, padding / 2);
      ctx.fill();

      // Draw text
      ctx.fillStyle = textColor;
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, position.x + padding + textWidth / 2, position.y + padding + fontSize / 2);
    }

    // Helper function to draw rounded rectangle
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
      this.beginPath();
      this.moveTo(x + radius, y);
      this.arcTo(x + width, y, x + width, y + height, radius);
      this.arcTo(x + width, y + height, x, y + height, radius);
      this.arcTo(x, y + height, x, y, radius);
      this.arcTo(x, y, x + width, y, radius);
      this.closePath();
    }

    // Draw the caption
    drawCaption(ctx);

    // Draw the CTA
    drawCTA(ctx);

  }, [selectedColor, image, captionT, ctaT]);



  return (
    <div className='container'>
      <div className="d-flex my-5 text-center " >
        <div className="p-2 flex-fill"><canvas ref={canvasRef}
          width={1080}
          height={1080}
          style={{ width: '400px', height: '400px' }} />
        </div>


        <div className="p-2 flex-fill justify-content-center " >

          <h2 className="ad-customization text-center">Ad Customization </h2>
          <h5 className="lead banner">Customise your ad and get the template accordinly </h5>

          <div className='container my-3 d-flex flex-column mb-3'>
            <input ref={imageRef} type="file" onChange={handleImageChange} />
            <label style={{fontSize: 'small'}} for="floatingTextarea">Select Background</label>
            <hr />
          </div>

          <div className="container">
            <div className="input-group ">
              <span className="input-group-text" id="inputGroup-sizing-default">Ad Content</span>
              <input type="text" ref={captionRef} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>

            <div className="input-group my-4">
              <span className="input-group-text" id="inputGroup-sizing-default">CTA</span>
              <input type="text" ref={ctaRef} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
            </div>
          </div>






          <div className='my-4 justify-content-center align-center flex '>
            <div className='justify-content-center ' style={{ display: 'flex', alignItems: 'center' }}>
              {lastPickedColors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    marginRight: '5px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                  onClick={() => handlePreviousColorClick(color)}
                />
              ))}
              <button style={{borderRadius: '50%'}} onClick={togglePicker}>+</button>
            </div>
              <label style={{fontSize: 'small'}} for="floatingTextarea">Select Background</label>
            {showPicker && (
              <div ref={pickerRef} style={{ position: 'absolute', zIndex: '1' }}>
                <SketchPicker color={selectedColor} onChange={handleColorChange} />
                
                
              </div>
            )}
          </div>

          <div>
            <button type="button" className="btn btn-outline-success" onClick={handleButtonClick}>Update</button>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Ad