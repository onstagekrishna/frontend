import Slider from "./Slider";
import ProductCatogeries from "./ProductCatogeries";
import Product from "./Product";
import BrandLogo from "./BrandLogo";
import Blog from "./Blog";
import AccessoriesSlider from "../Component/AccessoriesSlider";

import Newproductslider from "../Component/Newproductslider";
import Numbercounter from "../Component/Numbercounter";

function Home(){
    return(
        <>
            <Slider />
            <ProductCatogeries />
            <Newproductslider />
            <Numbercounter />   
            <Product />
            <AccessoriesSlider/> 
            <BrandLogo />
            <Blog />
              
        </>
    );
}

export default Home;