// Correction principale du problème des dropdowns sur tablette

// Le problème vient principalement de l'utilisation de "next/router" qui n'est plus compatible avec les nouvelles versions de Next.js
// et du fait que certains positionnements des dropdowns ne sont pas correctement adaptés aux tablettes

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
// Remplacer useRouter par usePathname de next/navigation
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  Layout,
  LineChart,
  Settings,
  Users,
  Code,
  Factory,
  Database,
  Building,
  TrendingUp,
  Heart,
  Truck,
  ShoppingBag,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Download,
  Calendar,
} from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() // Utiliser usePathname au lieu de useRouter
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  // États pour contrôler l'affichage des menus déroulants
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Référence pour le dropdown container (pour fermer le dropdown quand on clique en dehors)
  const dropdownRef = useRef(null)
  // Références pour chaque bouton de dropdown
  const dropdownButtonRefs = useRef({})
  // Références pour chaque contenu de dropdown
  const dropdownContentRefs = useRef({})

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      // S'assurer que le positionnement des dropdowns est recalculé lors du redimensionnement
      if (activeDropdown) {
        setActiveDropdown(activeDropdown);
      }
    }

    // Ferme le dropdown quand on clique en dehors
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown])

  // Ferme le dropdown quand on change de page
  useEffect(() => {
    setActiveDropdown(null)
    setIsOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  // Fonction pour déterminer le style du dropdown en fonction de la taille d'écran
  const getDropdownStyle = (key) => {
    // Sur tablette (768px - 1024px), positionner de façon fixe
    if (windowWidth >= 768 && windowWidth < 1024) {
      return {
        position: "fixed",
        left: "0",
        right: "0",
        width: "100%",
        maxWidth: "100%",
        transform: "none",
        top: dropdownButtonRefs.current[key]?.getBoundingClientRect().bottom || "auto",
        zIndex: 50,
      }
    }

    // Sur mobile, aligner à gauche
    if (windowWidth < 768) {
      return {
        position: "absolute",
        left: "0",
        right: "auto",
        width: "90vw",
        transform: "none",
      }
    }

    // Sur desktop, positionnement standard
    if (!dropdownButtonRefs.current[key]) {
      return {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(90vw, 800px)",
      }
    }

    const buttonRect = dropdownButtonRefs.current[key].getBoundingClientRect()
    const buttonCenter = buttonRect.left + buttonRect.width / 2
    const halfDropdownWidth = 400

    if (buttonCenter - halfDropdownWidth < 0) {
      // Trop à gauche, aligner à gauche
      return {
        position: "absolute",
        left: "0",
        right: "auto",
        width: "min(90vw, 800px)",
        transform: "none",
      }
    } else if (buttonCenter + halfDropdownWidth > windowWidth) {
      // Trop à droite, aligner à droite
      return {
        position: "absolute",
        left: "auto",
        right: "0",
        width: "min(90vw, 800px)",
        transform: "none",
      }
    } else {
      // Centrer sous le bouton
      return {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(90vw, 800px)",
      }
    }
  }

  // Data pour les menus déroulants
  const dropdownMenus = {
    features: {
      title: "Fonctionnalités",
      subtitle: "Découvrez tout ce que Twool Labs peut faire pour votre entreprise",
      sections: [
        {
          title: "Fonctionnalités principales",
          items: [
            { name: "Modélisation des processus", href: "/features/modeling", icon: <Layout className="h-5 w-5" /> },
            { name: "Simulations avancées", href: "/features/simulations", icon: <LineChart className="h-5 w-5" /> },
            { name: "IA prédictive", href: "/features/ai", icon: <Settings className="h-5 w-5" /> },
            { name: "Tableaux de bord", href: "/features/dashboards", icon: <Database className="h-5 w-5" /> },
          ],
        },
        {
          title: "Pour votre équipe",
          items: [
            { name: "Collaboration", href: "/features/collaboration", icon: <Users className="h-5 w-5" /> },
            { name: "Intégrations & API", href: "/features/integrations", icon: <Code className="h-5 w-5" /> },
          ],
        },
      ],
      featured: {
        title: "Nouvelle fonctionnalité",
        description: "Découvrez notre moteur d'optimisation automatique basé sur l'IA",
        href: "/features/auto-optimization",
        image: "/images/features-preview.jpg",
      },
    },

    solutions: {
      title: "Solutions",
      subtitle: "Solutions adaptées à votre secteur d'activité",
      sections: [
        {
          title: "Par secteur",
          items: [
            {
              name: "Industrie manufacturière",
              href: "/solutions/manufacturing",
              icon: <Factory className="h-5 w-5" />,
            },
            { name: "Services financiers", href: "/solutions/finance", icon: <Building className="h-5 w-5" /> },
            { name: "Santé", href: "/solutions/healthcare", icon: <Heart className="h-5 w-5" /> },
            { name: "Logistique", href: "/solutions/logistics", icon: <Truck className="h-5 w-5" /> },
            { name: "Commerce de détail", href: "/solutions/retail", icon: <ShoppingBag className="h-5 w-5" /> },
          ],
        },
        {
          title: "Par objectif",
          items: [
            {
              name: "Réduction des coûts",
              href: "/solutions/cost-reduction",
              icon: <TrendingUp className="h-5 w-5" />,
            },
            {
              name: "Optimisation des ressources",
              href: "/solutions/resource-optimization",
              icon: <Settings className="h-5 w-5" />,
            },
          ],
        },
      ],
      featured: {
        title: "Étude de cas",
        description: "Comment Globex a réduit ses coûts opérationnels de 47%",
        href: "/case-studies/globex",
        image: "/images/solutions-preview.jpg",
      },
    },

    resources: {
      title: "Ressources",
      subtitle: "Apprenez à tirer le meilleur parti de Twool Labs",
      sections: [
        {
          title: "Documentation",
          items: [
            { name: "Guide de démarrage", href: "/resources/getting-started", icon: <BookOpen className="h-5 w-5" /> },
            { name: "Tutoriels", href: "/resources/tutorials", icon: <FileText className="h-5 w-5" /> },
            { name: "Webinaires", href: "/resources/webinars", icon: <Video className="h-5 w-5" /> },
            { name: "FAQ", href: "/resources/faq", icon: <HelpCircle className="h-5 w-5" /> },
          ],
        },
        {
          title: "Centre de ressources",
          items: [
            { name: "Livre blanc", href: "/resources/whitepaper", icon: <Download className="h-5 w-5" /> },
            { name: "Blog", href: "/blog", icon: <FileText className="h-5 w-5" /> },
            { name: "Événements", href: "/resources/events", icon: <Calendar className="h-5 w-5" /> },
          ],
        },
      ],
      featured: {
        title: "Nouvel article",
        description: "Les 5 étapes clés pour réussir votre transformation digitale",
        href: "/blog/digital-transformation-steps",
        image: "/images/resources-preview.jpg",
      },
    },
  }

  // Navigation items
  const navItems = [
    { name: "Fonctionnalités", key: "features", dropdown: true },
    { name: "Solutions", key: "solutions", dropdown: true },
    { name: "Tarifs", href: "/pricing", dropdown: false },
    { name: "Témoignages", href: "/testimonials", dropdown: false },
    { name: "Ressources", key: "resources", dropdown: true },
  ]

  // Déterminer si on est sur tablette
  const isTablet = windowWidth >= 768 && windowWidth < 1024

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
      ref={dropdownRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center">
              <div className={`flex items-center`}>
                <div
                  className={`w-12 h-12 ${scrolled ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"} rounded-full flex items-center justify-center shadow-md`}
                >
                  <span className="text-xl font-bold">T</span>
                </div>
                <span className={`ml-2 font-bold text-xl ${scrolled ? "text-gray-800" : "text-white"}`}>Twool</span>
              </div>
            </Link>
          </div>

          {/* Menu desktop/tablet avec breakpoints progressifs */}
          <div className="hidden lg:block">
            <div className="ml-6 lg:ml-10 flex items-center space-x-4 lg:space-x-8">
              {navItems.map((item, index) => (
                <div key={item.key || item.name} className="relative">
                  {item.dropdown ? (
                    <button
                      ref={(el) => (dropdownButtonRefs.current[item.key] = el)}
                      onClick={() => toggleDropdown(item.key)}
                      className={`flex items-center text-sm font-medium ${
                        scrolled ? "text-gray-700 hover:text-indigo-600" : "text-gray-100 hover:text-white"
                      } transition-colors duration-200 cursor-pointer`}
                    >
                      {item.name}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.key ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-sm font-medium ${
                        scrolled ? "text-gray-700 hover:text-indigo-600" : "text-gray-100 hover:text-white"
                      } transition-colors duration-200`}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Mega Dropdown Menu avec positionnement adaptatif */}
                  {item.dropdown && activeDropdown === item.key && (
                    <div
                      ref={(el) => (dropdownContentRefs.current[item.key] = el)}
                      style={getDropdownStyle(item.key)}
                      className={`${
                        isTablet ? "fixed left-0 right-0 w-full" : "absolute top-full pt-5"
                      } z-50 mt-5`}
                    >
                      {/* Dropdown content */}
                      <div className={`bg-white rounded-xl shadow-2xl overflow-hidden ${isTablet ? "mt-2" : ""}`}>
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white">
                          <div className="col-span-1">
                            <div className="flex flex-col h-full">
                              <div className="px-3">
                                <h3 className="text-lg font-bold text-gray-900">{dropdownMenus[item.key].title}</h3>
                                <p className="mt-1 text-sm text-gray-500">{dropdownMenus[item.key].subtitle}</p>
                              </div>

                              <div className="mt-5 flex-1">
                                {dropdownMenus[item.key].sections.map((section, idx) => (
                                  <div key={idx} className="mb-5">
                                    <h4 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      {section.title}
                                    </h4>
                                    <div className="mt-1 space-y-1">
                                      {section.items.map((subitem) => (
                                        <Link
                                          key={subitem.name}
                                          href={subitem.href}
                                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                          <span className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-100 text-indigo-600 mr-3">
                                            {subitem.icon}
                                          </span>
                                          {subitem.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Featured section */}
                          <div className="col-span-1 bg-gray-50 rounded-lg p-6">
                            <div className="relative h-full flex flex-col">
                              <div className="relative h-40 rounded-lg overflow-hidden">
                                {/* Placeholder image */}
                                <div className="absolute inset-0 bg-indigo-600 opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-lg font-bold text-indigo-800">Image d'aperçu</span>
                                </div>
                              </div>
                              <div className="mt-4">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {dropdownMenus[item.key].featured.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  {dropdownMenus[item.key].featured.description}
                                </p>
                                <Link
                                  href={dropdownMenus[item.key].featured.href}
                                  className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  En savoir plus
                                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom call to action */}
                        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                          <div className="flex-1 flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <HelpCircle className="h-6 w-6 text-indigo-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">Besoin d'aide?</p>
                              <p className="text-xs text-gray-500">Notre équipe est prête à vous aider</p>
                            </div>
                          </div>
                          <div>
                            <Link
                              href="/contact"
                              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                            >
                              Contacter le support
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
          {/* Buttons avec breakpoints progressifs */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-4">
            <Link
              href="/auth/login"
              className={`text-sm font-medium ${
                scrolled ? "text-gray-700 hover:text-indigo-600" : "text-gray-100 hover:text-white"
              } transition-colors duration-200`}
            >
              Connexion
            </Link>
            <Link
              href="/auth/signup"
              className={`px-3 md:px-5 py-2 md:py-2.5 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
                scrolled
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                  : "bg-white text-indigo-600 hover:text-indigo-700 hover:bg-gray-100"
              }`}
            >
              <span className="hidden md:inline">Inscription gratuite</span>
              <span className="inline md:hidden">Inscription</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled
                  ? "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                  : "text-white hover:text-white hover:bg-indigo-700"
              }`}
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} lg:hidden bg-white shadow-lg`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 mt-5">
          {navItems.map((item) => (
            <div key={item.key || item.name}>
              {item.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                      activeDropdown === item.key
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    }`}
                  >
                    {item.name}
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        activeDropdown === item.key ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === item.key && (
                    <div className="mt-2 pl-4 space-y-2">
                      {dropdownMenus[item.key].sections.map((section) => (
                        <div key={section.title} className="mb-3">
                          <h5 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {section.title}
                          </h5>
                          <div className="mt-1">
                            {section.items.map((subitem) => (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                <span className="mr-3 text-indigo-500">{subitem.icon}</span>
                                {subitem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 pb-2">
            <Link
              href="/auth/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              Connexion
            </Link>
            <Link
              href="/auth/signup"
              className="block mx-3 mt-2 px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 text-center shadow-md"
            >
              S'inscrire maintenant
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;