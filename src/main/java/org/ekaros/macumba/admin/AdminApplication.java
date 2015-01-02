package org.ekaros.macumba.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;



@Configuration
@ComponentScan(basePackages={"org.opencommunity","org.index"})
@EnableAutoConfiguration(exclude = JpaRepositoriesAutoConfiguration.class)
//@EnableAspectJAutoProxy
//	,excludeFilters=
//		{
//		@ComponentScan.Filter(value= org.opencommunity.filter.AllowOriginFilter.class, type=FilterType.ASSIGNABLE_TYPE),
//		@ComponentScan.Filter(value= org.index.filter.AllowOriginFilter.class, type=FilterType.ASSIGNABLE_TYPE)
//		}
//@EnableJpaRepositories(basePackages={"org.opencommunity","org.index"})
@PropertySource({"application.properties"})
//@EnableSpringConfigured
public class AdminApplication extends SpringBootServletInitializer
{

	public AdminApplication()
		{
		
		}
	
	@Override
	 protected SpringApplicationBuilder configure(SpringApplicationBuilder application) 
		{
		return application.sources(AdminApplication.class);
		}
    public static void main(String[] args) 
    	{
        SpringApplication.run(AdminApplication.class, args);        
    	}
}