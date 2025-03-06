
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Train, Users, BookOpen, Clock, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { isAuthenticated } = useUser();

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: 'בחר תחום לימוד',
      description: 'תלמוד, הלכה, משנה, חומש, חסידות או כל תחום אחר',
    },
    {
      icon: <Train className="h-10 w-10 text-primary" />,
      title: 'הגדר מסלול נסיעה',
      description: 'בחר תחנות ושעות נסיעה ברכבת ישראל',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'מצא את החברותא המושלמת',
      description: 'המערכת תתאים עבורך חברותא בהתאם להעדפותיך',
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'נצל את זמן הנסיעה',
      description: 'הפוך את זמן הנסיעה לזמן איכות של לימוד ושיחה מעשירה',
    },
  ];

  const testimonials = [
    {
      text: "מצאתי חברותא נהדר שלומד איתי בדרך לעבודה. הפכנו את זמן הנסיעה למשהו שאני ממש מצפה לו.",
      name: "יוסי כהן",
      route: "תל אביב - חיפה",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      text: "אחרי שנים של נסיעות ברכבת, סוף סוף יש לי חברותא קבוע ללימוד דף יומי. זה משנה את כל חווית הנסיעה.",
      name: "דוד לוי",
      route: "ירושלים - תל אביב",
      image: "https://randomuser.me/api/portraits/men/41.jpg"
    },
    {
      text: "החיבור לחברותא היה מושלם. שנינו לומדים את אותה מסכת ונוסעים באותו קו. ממליצה בחום!",
      name: "מירי הלוי",
      route: "רחובות - תל אביב",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 animated-gradient rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 z-0"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-slide-down flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>יוזמה חדשה לניצול זמן הנסיעה ברכבת</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl animate-slide-down bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent" style={{ animationDelay: '0.1s' }}>
              חברותא ברכבת ישראל
            </h1>
            <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slide-down" style={{ animationDelay: '0.2s' }}>
              מצא שותף ללימוד תורה במהלך נסיעותיך ברכבת והפוך את זמן הנסיעה לזמן משמעותי
            </p>
            <div className="flex flex-col gap-3 min-[400px]:flex-row mt-8 animate-slide-down" style={{ animationDelay: '0.3s' }}>
              <Link to={isAuthenticated ? "/topics" : "/register"}>
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/20 hover-lift focus-ring group px-6 py-6 h-auto rounded-full">
                  <span className="text-lg">
                    {isAuthenticated ? 'המשך למציאת חברותא' : 'הצטרף עכשיו'}
                  </span>
                  <ArrowRight className="h-5 w-5 mr-2 transform group-hover:translate-x-[-4px] transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="hover-lift focus-ring rounded-full px-6 py-6 h-auto border-2 group">
                <span className="text-lg">איך זה עובד?</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Match Cards Preview */}
      <section className="w-full py-16 -mt-8 relative">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs">
              <div className="absolute top-8 -left-12 transform -rotate-12 z-10 animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                <Card className="card-gradient-accent card-shadow w-60 h-80 rounded-2xl overflow-hidden border-0 animate-pulse">
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <Heart className="h-16 w-16 text-accent heart-pulse mb-4" />
                    <h3 className="font-bold text-xl mb-2">התאמה מושלמת!</h3>
                    <p className="text-sm">מוצאים חברותא שמתאימה בדיוק לתחומי הלימוד ומסלול הנסיעה שלך</p>
                  </div>
                </Card>
              </div>
              <Card className="card-gradient card-shadow w-64 h-96 rounded-2xl overflow-hidden border-0 z-20 relative animate-bounce-in">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">לימוד תורה בדרכים</h3>
                  <p>מצא את החברותא המושלמת לנסיעות ברכבת</p>
                  <div className="mt-8">
                    <Button className="rounded-full px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20">
                      התחל עכשיו
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute top-12 -right-12 transform rotate-12 z-10 animate-bounce-in" style={{ animationDelay: '0.4s' }}>
                <Card className="card-gradient card-shadow w-56 h-72 rounded-2xl overflow-hidden border-0">
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <Train className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-bold text-lg mb-2">נסיעות משותפות</h3>
                    <p className="text-sm">נצל את זמן הנסיעה ברכבת ללימוד תורה משותף</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                איך זה עובד
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                מצא חברותא בארבעה צעדים פשוטים
              </h2>
              <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-12">
                תהליך פשוט ומהיר שיעזור לך למצוא את החברותא המתאימה עבורך
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-3 rounded-3xl p-6 shadow-lg hover-pulse card-gradient border-0 relative overflow-hidden fade-up"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 animated-gradient-accent rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 z-0"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-accent/20 px-3 py-1 text-sm text-accent mb-4">
                סיפורי הצלחה
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                מה המשתמשים שלנו אומרים
              </h2>
              <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                משתמשים רבים כבר מצאו חברותא מתאימה דרך הפלטפורמה שלנו
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col space-y-4 rounded-3xl p-6 shadow-lg card-gradient border-0 hover-lift relative overflow-hidden fade-up"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <p className="text-gray-600 flex-grow mb-4 text-right">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-12 w-12 rounded-full border-2 border-primary/20"
                    />
                    <div className="text-right">
                      <h4 className="text-base font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        נוסע מסלול {testimonial.route}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="rounded-3xl overflow-hidden border-0 card-shadow">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 md:p-12 text-center relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <Heart className="h-12 w-12 text-accent mb-6 heart-pulse" />
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                    מוכן למצוא חברותא?
                  </h2>
                  <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-8">
                    הצטרף עכשיו וגלה כמה קל למצוא שותף ללימוד תורה בזמן הנסיעה ברכבת
                  </p>
                  <div>
                    <Link to={isAuthenticated ? "/topics" : "/register"}>
                      <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/20 hover-lift focus-ring rounded-full px-8 py-6 h-auto">
                        <span className="text-lg">
                          {isAuthenticated ? 'המשך למציאת חברותא' : 'הצטרף עכשיו'}
                        </span>
                        <ArrowRight className="h-5 w-5 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
