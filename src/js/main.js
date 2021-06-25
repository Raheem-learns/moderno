$(function() {
  let mixer = mixitup('.products__inner-cards');
  $(".rate-star").rateYo({
    rating: 5,
    starWidth: "12px",
    readOnly: true,
  });
});

$('.products-slider__inner').slick({
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 4,
  arrows: false,
  dots: true,
});


