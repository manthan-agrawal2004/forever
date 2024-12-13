import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            At Forever, we believe that style is timeless, just like our name.
            Our mission is to provide clothing that blends comfort, quality, and
            elegance, empowering you to express your unique personality every
            day. Designed with passion and crafted with care, our collections
            cater to diverse tastes, ensuring there’s something for everyone.
            Whether you’re dressing for a casual outing or a special occasion,
            Forever is here to be your go-to wardrobe destination. Let us be
            part of your journey to celebrate individuality and confidence.
          </p>
          <p>
            At Forever, sustainability and innovation lie at the heart of our
            process. We are committed to making choices that are kind to the
            planet while delivering styles that stand the test of time. From
            responsibly sourced materials to ethical production practices, every
            step we take reflects our dedication to creating a positive impact.
            We envision a world where fashion is inclusive, accessible, and
            sustainable, and we are proud to contribute to that vision. Thank
            you for choosing Forever – where your style becomes a part of our
            story.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            At Forever, our mission is to redefine fashion by creating timeless
            clothing that celebrates individuality, promotes sustainability, and
            empowers confidence. We are dedicated to offering high-quality,
            stylish apparel that resonates with diverse lifestyles while
            prioritizing ethical practices and environmental responsibility. By
            blending creativity, comfort, and conscious choices, we aim to
            inspire a community that values self-expression and embraces a
            better future for fashion.
          </p>
        </div>
      </div>
      <div className="text-4xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20 ">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600 ">
            At Forever, we go beyond clothing to craft an experience tailored
            just for you. Our commitment to quality ensures that every piece in
            our collection is designed to last, offering timeless elegance and
            unmatched comfort. With a focus on sustainable and ethical
            practices, you can feel good about your choices while looking great.
            Whether it’s our diverse range of styles, personalized customer
            service, or attention to detail, we prioritize your satisfaction
            every step of the way. Choose Forever, because you deserve fashion
            that’s as unique and enduring as you are.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600 ">
            At Forever, we make shopping effortless and enjoyable. With an
            intuitive website, seamless navigation, and a user-friendly
            interface, finding your perfect outfit has never been easier. Our
            flexible payment options, reliable delivery services, and
            hassle-free returns ensure a smooth experience from start to finish.
            Whether you’re shopping on the go or from the comfort of your home,
            Forever is here to bring style to your doorstep with ease and
            efficiency.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600 ">
            At Forever, our customers are at the heart of everything we do. We
            are dedicated to providing a seamless and personalized shopping
            experience, backed by a team of friendly and knowledgeable
            professionals ready to assist you at every step. From answering your
            queries to ensuring prompt resolutions, we go the extra mile to
            exceed your expectations. Your satisfaction is our priority, and we
            strive to build lasting relationships by delivering service that
            truly stands out.
          </p>
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  );
};

export default About;
