import styled from "@emotion/styled";
const Button = styled.button`
  border: none;
  border-radius: 4rem;
  font-family: "Caveat";
  font-size: 2rem;
  background: var(--chakra-colors-primary);
  background: linear-gradient(
    0deg,
    var(--chakra-colors-primary) 0%,
    rgba(234, 76, 137, 1) 100%
  );
  color: #fff;
  position: relative;
  overflow: hidden;

  &:hover {
    text-decoration: none;
    color: #fff;
  }
  &:before {
    position: absolute;
    content: "";
    display: inline-block;
    top: -180px;
    left: 0;
    width: 30px;
    height: 100%;
    background-color: #fff;
    animation: shiny-btn1 3s ease-in-out infinite;
  }
  &:hover {
    opacity: 0.7;
  }
  &:active {
    box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
      -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
      inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2),
      inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  }

  @-webkit-keyframes shiny-btn1 {
    0% {
      -webkit-transform: scale(0) rotate(45deg);
      opacity: 0;
    }
    80% {
      -webkit-transform: scale(0) rotate(45deg);
      opacity: 0.5;
    }
    81% {
      -webkit-transform: scale(4) rotate(45deg);
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(50) rotate(45deg);
      opacity: 0;
    }
  }
`;

export default Button;
