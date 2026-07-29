import { useState } from "react";
import { GiGuitar } from "react-icons/gi";
import { IoStar } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";

const catogeryesProducts = [
    {
        id: 1,
        name: "Acoustic Drum",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666738/Untitled_design_5_1_lydd7q.jpg",
        insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20 %"
    },
    {
        id: 2,
        name: "Studio Moniter",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666738/download_rmyqgs.jpg",
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20 %"

    },
    {
        id: 3,
        name: "Accessories",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666737/2020s_NS_Design_WAV_4_Electric_Violin_Amber_Burst_1_uwrbzc.jpg",
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20%"
    },

    {
        id: 4,
        name: "Amp Rxtico",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666737/Untitled_design_3_axzwoh.jpg",
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20%"

    },
    {
        id: 5,
        name: "Electric Guitars",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666739/Souldier_Hendrix_2__Guitar_Strap___Reverb_i9zcxh.jpg",
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20%"
    },

    {
        id: 6,
        name: "Bass Guitars",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666740/Untitled_design_8_1_ggdncm.jpg",
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20%"

    },
    {
        id: 7,
        name: "Mixers",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666740/Untitled_design_4_1_pqvyzs.jpg",
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],

        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20%"

    },
    {
        id: 8,
        name: "Acoustic Guitars",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666740/Untitled_design_6_kna0dx.jpg",
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20%"

    },
    {
        id: 9,
        name: "Controller",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666740/Untitled_design_7_1_a91fnh.jpg",        
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20%"

    },
    {
        id: 10,
        name: "Acoustic Drum",
        image: "https://res.cloudinary.com/dfilhi9ku/image/upload/v1757666738/Untitled_design_5_1_lydd7q.jpg",
           insideImages:[{
            one:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            two:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
            three:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=800/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_bck_1_rl.png",
             four:"https://www.fender.com/cdn-cgi/image/format=auto,resize=height=auto,width=1500/https://www.fmicassets.com/Damroot/eCommPNG/10103/0148092368_fen_ins_frt_1_rr.png",
            
        }],
        model: "Model Name",
        discripction: "discripction",
        rating: "4",
        price: "1000",
        save: "20 %"
    },

];

const buttons = [
    "Acoustic Guitar ",
    "Acoustic Guitar ",
    "Acoustic Guitar ",
    "Acoustic Guitar ",
    "Acoustic Guitar ",
    "More Products "
];

export default function OurProducts() {

    const [topProducts] = useState(catogeryesProducts);
    const [activeIndex, setActiveIndex] = useState(null);
    const  Navigate = useNavigate();





    return (
        <>
            <section>
                <div className="margin-and-padding-main">
                    <div className="our-tranding-products">
                        <div className="main-sectionHeading">
                            <h1 className="onstage-heading">OUR TRANDING PRODUCTS </h1>
                        </div>


                        <div className="main-class-with-buttons-and-products-lists">
                            <div className="items-buttons-for-chaging-the-screen">
                                {buttons.map((label, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        className={activeIndex === idx ? "active-btn" : ""}                                    >
                                        {label !== "More" && <span><GiGuitar /></span>}
                                        {label}
                                    </button>
                                ))}

                            </div>

                            <div className="top-products-main-content">

                                {/* <div className="priviousimage">
                                            <button onClick={priviousImageFunction}> <GrPrevious /> </button>
                                        </div> */}
                                <div className="trending-products-images margin-top-for-inside-continers">
                                    {
                                        topProducts.map((topProductsItems) => (
                                            <div className="tranding-products-of-us"
                                             key={topProductsItems.id}
                                              onClick={() => Navigate("/productDetails", { state:topProductsItems})}>

                                                <div className="rating-and-discount">
                                                    <div className="discount">
                                                        <ul>
                                                            <li><span>Save </span> {topProductsItems.save}</li>
                                                        </ul>
                                                    </div>

                                                    <div className="rating">
                                                        <ul>
                                                            <li><span><IoStar /></span>{topProductsItems.rating}</li>
                                                        </ul>
                                                    </div>
                                                </div>


                                                <div className="trending-products-images-main-inside">
                                                    <img key={topProductsItems.id} src={topProductsItems.image} alt={topProductsItems.name} />
                                                </div>


                                                <div className="product-name-model-name-price">

                                                    <div className="model-name dotted-border">
                                                        <p>{topProductsItems.model.toUpperCase()}</p>
                                                    </div>

                                                    <div className="model-descripction  dotted-border">

                                                        <p>{topProductsItems.discripction}</p>

                                                    </div>

                                                    <div className="model-price  dotted-border">

                                                        <p>{topProductsItems.price}</p>
                                                    </div>

                                                </div>




                                            </div>

                                        ))
                                    }


                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}