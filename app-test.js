const fs = require('fs');
const PDF = require('pdfkit');
const csv = require('fast-csv');

 // Array of table for PDF 
const people = [
{ name: 'Person 1'},
{ name: 'Person 2'},
{ name: 'Person 3'},
];

       
// looping array of table
let i = 10000;

people.forEach((person) => {
    i++;
    let doc = new PDF();
   
    doc.pipe(fs.createWriteStream(`pdf-files/${i}-${person.name}.pdf`));
    
    doc.image('images/logo1.jpg', {
      fit: [50, 50],
      align: 'left',
      valign: 'left'
   });
   

    doc.text(`Your ID is ${i}\nYour Name: ${person.name}`,50, 130);

    // Table
    function createTable(doc, rows, fontName, fontSize) {
        doc.font(fontName || 'Helvetica', fontSize || 10);
      
        const pageWidth = Math.round(doc.page.width - doc.page.margins.left - doc.page.margins.right);
        const textSpacer = 10;
      
        let { y } = doc;
        const { x } = doc;
      
        rows.forEach(row => {
          // table border
          const arr = row.map(column => doc.heightOfString(column.text, { width: column.width * pageWidth }));
      
          const cellHeight = Math.max(...arr) + textSpacer * 2;
          doc.lineWidth(0.3);
          doc.strokeColor('lightgrey');
      
          doc
            .lineJoin('miter')
            .rect(x, y, pageWidth, cellHeight)
            .stroke();
      
          let writerPos = x;
          for (let i = 0; i < row.length - 1; i++) {
            writerPos += row[i].width * pageWidth;
      
            doc
              .lineCap('butt')
              .moveTo(writerPos + textSpacer, y)
              .lineTo(writerPos + textSpacer, y + cellHeight)
              .stroke();
          }
      
          // table text
          let textWriterPos = x;
          for (let i = 0; i < row.length; i++) {
            doc.text(row[i].text, textWriterPos + textSpacer, y + textSpacer, {
              continued: false,
              width: row[i].width * pageWidth - (textSpacer + 5),
            });
            textWriterPos += row[i].width * pageWidth + (textSpacer - 5);
          }
      
          y += cellHeight;
        });
      
        doc.moveDown(2);
        doc.text('', doc.page.margins.left);
      }
      

      const testData = [
        [
          {
            text: 'row1 column1',
            width: 0.3,
          },
          {
            text: 'row1 column2',
            width: 0.7,
          },
        ],
        [
          {
            text: 'row2 column1',
            width: 0.3,
          },
          {
            text: 'row2 column2',
            width: 0.7,
          },
        ],
      ];
      createTable(doc, testData);
      
      
      doc.end();
    console.log(`PDF created for ${person.name}`);
});