import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, Mail, Plus, Ticket as TicketIcon, User } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("faq");

    return (
        <div className="w-full min-h-screen dmsans-regular bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-center space-y-4 flex-1">
                    <a href="/" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                        <img
                            src="/assets/logo-bumi.png"
                            alt="Bumi Logo"
                            width={50}
                            className="w-44 h-auto"
                        />
                        <h1 className="text-4xl dmsans-semibold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                            Helpdesk System
                        </h1>
                    </a>
                </div>


                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-between">
                        <TabsList className="grid w-auto grid-cols-3 bg-white border border-blue-200">
                            <TabsTrigger
                                value="faq"
                                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                            >
                                <TicketIcon className="h-4 w-4" />
                                FAQ
                            </TabsTrigger>
                            <TabsTrigger
                                value="create"
                                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                            >
                                <Plus className="h-4 w-4" />
                                Create Ticket
                            </TabsTrigger>
                            <TabsTrigger
                                value="contact"
                                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                            >
                                <User className="h-4 w-4" />
                                Contact Support
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="faq" className="space-y-6 w-full">
                        <div className="bg-white rounded-xl border border-blue-200 p-6 w-full">
                            <h2 className="text-2xl dmsans-semibold text-blue-800 mb-6">Frequently Asked Questions</h2>

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1" className="border-b border-blue-100">
                                    <AccordionTrigger className="dmsans-medium hover:no-underline hover:bg-blue-50 px-4 py-4 rounded-lg w-full text-left">
                                        How do I create a new ticket?
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pt-2 pb-4 text-gray-700">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2" className="border-b border-blue-100">
                                    <AccordionTrigger className="dmsans-medium hover:no-underline hover:bg-blue-50 px-4 py-4 rounded-lg w-full text-left">
                                        What information should I include in a ticket?
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pt-2 pb-4 text-gray-700">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3" className="border-b border-blue-100">
                                    <AccordionTrigger className="dmsans-medium hover:no-underline hover:bg-blue-50 px-4 py-4 rounded-lg w-full text-left">
                                        How long does it take to get a response?
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pt-2 pb-4 text-gray-700">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4" className="border-b border-blue-100">
                                    <AccordionTrigger className="dmsans-medium hover:no-underline hover:bg-blue-50 px-4 py-4 rounded-lg w-full text-left">
                                        Can I edit a ticket after submitting?
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pt-2 pb-4 text-gray-700">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-5">
                                    <AccordionTrigger className="dmsans-medium hover:no-underline hover:bg-blue-50 px-4 py-4 rounded-lg w-full text-left">
                                        How do I check the status of my ticket?
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pt-2 pb-4 text-gray-700">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </TabsContent>

                    <TabsContent value="create">
                        <div className="flex flex-col justify-center items-start bg-white rounded-xl border border-blue-200 p-6 w-full">
                            <h2 className="text-2xl dmsans-semibold text-blue-800 mb-6">Create New Ticket</h2>
                            <a href="/login">
                                <Button className="flex items-center gap-2 bg-blue-600">
                                    Sign in to create ticket <LogIn />
                                </Button>
                            </a>
                        </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-6 w-full">
                        <div className="bg-white rounded-xl border border-blue-200 p-6 w-full flex flex-col gap-2">
                            <h2 className="text-2xl dmsans-semibold text-blue-800">Contact Support</h2>
                            <p className="text-gray-700 mb-4">Contact us and tell the details of your questions on our email or WhatsApp.</p>
                            <a href="mailto:bumi@hakaauto.co.id">
                                <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 transition-all">
                                    Email <Mail />
                                </Button>
                            </a>
                            <a
                                href="https://wa.me/+62895392525133?text=Hello%20Bumi%20Auto%20Helpdesk%2C%20I%20want%20to%20..."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-400 transition-all">
                                    WhatsApp <FaWhatsapp />
                                </Button>
                            </a>

                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default FAQ;