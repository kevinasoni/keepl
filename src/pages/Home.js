import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import familyImg from "../assets/family.png";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 80px;
  background: #232b38;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const Logo = styled(Link)`
  font-family: 'Playfair Display', serif;
  font-size: 2.6rem;
  font-weight: 900;
  text-decoration: none;
`;

const LogoYellow = styled.span`
  color: #ffc107;
`;

const LogoBlue = styled.span`
  color: #2990fc;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled(Link)`
  padding: 10px 22px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid #ffffff;
  color: #ffffff;
  transition: 0.25s ease;

  &:hover {
    background: #ffffff;
    color: #232b38;
  }
`;

const Hero = styled.div`
  height: 85vh;
  background: linear-gradient(
      rgba(0,0,0,0.35),
      rgba(0,0,0,0.35)
    ),
    url(${familyImg});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 80px;
`;

const HeroContent = styled.div`
  max-width: 520px;
  background: rgba(255,255,255,0.92);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #1b365d;
  margin-bottom: 15px;
`;

const SubText = styled.p`
  font-size: 1.25rem;
  color: #283b5c;
  line-height: 1.7;
  margin-bottom: 25px;
`;

const CTA = styled(Link)`
  padding: 16px 36px;
  background: #1b365d;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.25s ease;
  display: inline-block;

  &:hover {
    background: #142843;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  }
`;

const Features = styled.div`
  padding: 80px;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 260px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const FeatureTitle = styled.h3`
  color: #1b365d;
  margin-bottom: 10px;
`;

const FeatureText = styled.p`
  color: #475569;
  font-size: 0.95rem;
`;

const Footer = styled.footer`
  background: #0f2b46;
  color: white;
  padding: 70px 80px 30px 80px;
  margin-top: auto;
`;

const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 60px;
  margin-bottom: 50px;
`;

const FooterCol = styled.div`
  min-width: 220px;
  max-width: 260px;
`;

const FooterTitle = styled.h4`
  margin-bottom: 18px;
`;

const FooterText = styled.p`
  color: #cbd5e1;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const FooterLink = styled(Link)`
  display: block;
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 10px;

  &:hover {
    color: white;
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255,255,255,0.15);
  padding-top: 20px;
  text-align: center;
  font-size: 0.85rem;
  color: #94a3b8;
`;

const Home = () => {

  const isLoggedIn = !!localStorage.getItem("token");

  const protectedLink = (path) => {
    return isLoggedIn ? path : "/login";
  };

  return (
    <Wrapper>

      <Nav>
        <Logo to="/">
          <LogoYellow>Keep</LogoYellow>
          <LogoBlue>Legacy</LogoBlue>
        </Logo>

        <NavButtons>
          <Button to="/login">Login</Button>
          <Button to="/register">Register</Button>
        </NavButtons>
      </Nav>

      <Hero>
        <HeroContent>

          <Title>Protect What Matters Most</Title>

          <SubText>
            KeepLegacy helps you securely organise your digital assets,
            documents, and personal information so your loved ones
            stay protected in the future.
          </SubText>

          <CTA to="/register">Get Started</CTA>

        </HeroContent>
      </Hero>

      <Features>

        <FeatureCard>
          <FeatureTitle>Secure Storage</FeatureTitle>
          <FeatureText>
            Safely store documents, passwords and digital assets.
          </FeatureText>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Beneficiary Access</FeatureTitle>
          <FeatureText>
            Give trusted people access to your important information.
          </FeatureText>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>AI Advisor</FeatureTitle>
          <FeatureText>
            AI guidance to help organise and manage your digital legacy.
          </FeatureText>
        </FeatureCard>

      </Features>

      <Footer>

        <FooterTop>

          <FooterCol>
            <Logo to="/">
              <LogoYellow>Keep</LogoYellow>
              <LogoBlue>Legacy</LogoBlue>
            </Logo>
            <FooterText style={{ marginTop: "12px" }}>
              Securely organise and protect your digital legacy.
            </FooterText>
          </FooterCol>

          <FooterCol>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink to="/login">Login</FooterLink>
            <FooterLink to="/register">Register</FooterLink>
            <FooterLink to={protectedLink("/beneficiaries")}>
              Beneficiaries
            </FooterLink>
            <FooterLink to={protectedLink("/dashboard")}>
              Dashboard
            </FooterLink>
          </FooterCol>

          <FooterCol>
            <FooterTitle>Site Developer</FooterTitle>
            <FooterText>SruVina</FooterText>
            <FooterText>Email: tableplanning01@gmail.com</FooterText>
          </FooterCol>

          <FooterCol>
            <FooterTitle>Admin</FooterTitle>

            <FooterText style={{fontWeight:"600",color:"white"}}>
              Kevina Soni
            </FooterText>

            <FooterText>Email: sonikevina@gmail.com</FooterText>
            <FooterText>Contact: +91 90235 33923</FooterText>

            <FooterText style={{marginTop:"10px",fontWeight:"600",color:"white"}}>
              Srushti Patel
            </FooterText>

            <FooterText>Email: patelsvp2004@gmail.com</FooterText>
            <FooterText>Contact: +91 79901 20193</FooterText>

          </FooterCol>

        </FooterTop>

        <BottomBar>
          © {new Date().getFullYear()} KeepLegacy. All rights reserved.
        </BottomBar>

      </Footer>

    </Wrapper>
  );
};

export default Home;