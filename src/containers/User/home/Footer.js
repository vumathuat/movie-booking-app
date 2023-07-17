import React from 'react';
import cgv from '../../../assets/img/cgv.png';
import bhd from '../../../assets/img/bhd.png';
import galaxy from '../../../assets/img/galaxycine.png';
import cinestar from '../../../assets/img/cinestar.png';
import lotte from '../../../assets/img/lottecinema.jpg';
import netflix from '../../../assets/img/netflix.png';
import beta from '../../../assets/img/beta.jpg';
import fptplay from '../../../assets/img/fptplay.png';
import disney from '../../../assets/img/disney.jpg';
import pluto from '../../../assets/img/pluto.png';
import hbomax from '../../../assets/img/hbomax.png';
import hulu from '../../../assets/img/hulu.png';
import crunchyroll from '../../../assets/img/crunchyroll.png';
import prime from '../../../assets/img/prime.jpg';
import appletv from '../../../assets/img/apple.png';
import apple from '../../../assets/img/apple-logo.png';
import insta from '../../../assets/img/instagram.png';
import fb from '../../../assets/img/meta.png';
import twitter from '../../../assets/img/twitter.png';
import tiktok from '../../../assets/img/tiktok.png';
import ggplay from '../../../assets/img/google-play.png';
import theatrical from '../../../assets/img/theatrical.png';
import bct from '../../../assets/img/bct.png';

let href = '#/';
const Footer = () => {
    return (
        <div className='footer'>
            <div className='container footer__content'>
                <div className='row'>
                    <div className='col-sm-4 footer__content-about'>
                        <p>THEATRICAL</p>
                        <div className='row'>
                            <div className='col-sm-6'>
                                <div className='footer__content-about-left'>
                                    <a>Terms and conditions</a>
                                    <a>Brand Guidelines</a>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='footer__content-about-right'>
                                    <a>Payment policy</a>
                                    <a>FAQ</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div className='footer__content-partner'>
                            <p>PARTNERS</p>
                        </div>
                        <div className='row mg'>
                            <div className='col-sm-12'>
                                <a>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={cgv}
                                        alt='CGV'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={bhd}
                                        alt='BHD'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={galaxy}
                                        alt='galaxycine'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={cinestar}
                                        alt='cinestar'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={lotte}
                                        alt='Lotte'
                                    />
                                </a>
                            </div>
                        </div>
                        <div className='row mg'>
                            <div className='col-sm-12'>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={netflix}
                                        alt='netflixcinemas'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={beta}
                                        alt='betacinemas'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={fptplay}
                                        alt='fptplayinema'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={disney}
                                        alt='disneycinema'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={pluto}
                                        alt='plutovn'
                                    />
                                </a>
                            </div>
                        </div>
                        <div className='row mg'>
                            <div className='col-sm-12'>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={hbomax}
                                        alt='hbomax'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={hulu}
                                        alt='hulu'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={crunchyroll}
                                        alt='zalopay'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={prime}
                                        alt='prime'
                                    />
                                </a>
                                <a href={href}>
                                    <img
                                        className='footer__content-partner-logo'
                                        src={appletv}
                                        alt='appletv'
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div className='row'>
                            <div className='col-sm-6'>
                                <div className='footer__content-apps'>
                                    <p>Mobile App</p>
                                    <div className='footer__content__apps-logo'>
                                        <a href={href}>
                                            <img
                                                src={apple}
                                                alt='apple'
                                                className='footer__content-apps-img'
                                            />
                                        </a>
                                        <a href={href}>
                                            <img
                                                src={ggplay}
                                                alt='ggplay'
                                                className='footer__content-apps-img'
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='footer__content-apps'>
                                    <p>Social</p>
                                    <div className='footer__content__apps-logo'>
                                        <a href={href}>
                                            <img
                                                src={fb}
                                                alt='facebook'
                                                className='footer__content-apps-img'
                                            />
                                        </a>
                                        <a href={href}>
                                            <img
                                                src={insta}
                                                alt='insta'
                                                className='footer__content-apps-img'
                                            />
                                        </a>
                                        <a href={href}>
                                            <img
                                                src={twitter}
                                                alt='twitter'
                                                className='footer__content-apps-img'
                                            />
                                        </a>
                                        <a href={href}>
                                            <img
                                                src={tiktok}
                                                alt='tiktok'
                                                className='footer__content-apps-img'
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='hr' />
                    <div className='row'>
                        <div className='col-sm-1'>
                            <img src={theatrical} alt='theatrical' className='theatrical-logo' />
                        </div>
                        <div className='col-sm-9 footer__content-info'>
                            <span>COMPANY THEATRICAL VIETNAM</span>
                            <span>
                                COMPANY THEATRICAL VIETNAM Business registration certificate: 0303675393, registered for the first time on 31/7/2008, registered for the fifth change on 14/10/2015, issued by HCMC Department of Planning and Investment.
                            </span>
                            <span>
                                Address: Floor 2, Rivera Park Saigon - No. 7/28 Thanh Thai street, Ward 14, District 10, HCMC.
                            </span>
                            <span>
                                COPYRIGHT 2023 THEATRICAL. All RIGHTS RESERVED.
                            </span>
                            <span>
                                Hotline: 0985368262 <br />
                                Email:{' '}
                                <a
                                    href={href}
                                    style={{
                                        color: '#EF3B33',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    longvule070402@gmail.com
                                </a>
                            </span>
                        </div>
                        <div className='col-sm-2'>
                            <img
                                src={bct}
                                alt='bocongthuong'
                                className='bct-logo'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
